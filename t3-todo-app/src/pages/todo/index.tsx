import React, { Fragment } from "react";
import { api } from "~/utils/api";
import { useState } from "react";
import { type Todo } from "@prisma/client";
import AddTodoForm from "~/components/AddTodoForm";
import Card from "~/components/Card";
import Link from "next/link";

const tabs = ["ALL", "DONE", "UNDONE"] as const;
type Status = (typeof tabs)[number];

const TodoListPage = () => {
  const [selectedTab, setSelectedTab] = useState<Status>(tabs[0]);

  const { data: allTodo, isFetching, isError } = api.todo.getAll.useQuery();

  if (isFetching) return <div className="mt-20 text-center">Loading...</div>;

  if (isError)
    return (
      <div className="mt-20 text-center">
        Something went wrong!
        <Link href="/" className="mx-auto block w-fit underline">
          Back to Top
        </Link>
      </div>
    );

  const filteredTodo = (allTodo: Todo[]) => {
    const filteredList = allTodo.filter((todo) => {
      switch (selectedTab) {
        case "ALL":
          return todo;
        case "DONE":
          return todo.isDone === true;
        case "UNDONE":
          return todo.isDone === false;
        default:
          return todo;
      }
    });
    return filteredList;
  };

  return (
    <>
      <section>
        <h1 className="my-10 text-center text-3xl font-bold">Todo List</h1>

        <ul className="mx-auto mb-6 flex w-fit items-center">
          {tabs.map((tab) => (
            <li
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`border-b-[2px] px-6 py-2 hover:cursor-pointer hover:bg-gray-100 ${
                selectedTab === tab ? "border-blue-400" : "border-transparent"
              }`}
            >
              {tab}
            </li>
          ))}
        </ul>

        <div className="mx-auto w-[90%] max-w-[650px] space-y-4">
          {allTodo &&
            allTodo.length > 0 &&
            filteredTodo(allTodo).map((todo) => (
              <Fragment key={todo.id}>
                <Card todo={todo} />
              </Fragment>
            ))}

          {allTodo && allTodo.length === 0 && (
            <p className="h-[100px] self-center text-center">No Todo</p>
          )}
        </div>

        <hr className="mx-auto my-10 w-[90%]" />

        <AddTodoForm />
      </section>

      <Link href="/" className="mx-auto mt-20 block w-fit underline">
        Back to Top
      </Link>
    </>
  );
};

export default TodoListPage;
