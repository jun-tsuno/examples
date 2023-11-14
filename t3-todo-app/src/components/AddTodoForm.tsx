import { type FormEvent } from "react";
import { useState } from "react";
import { api } from "~/utils/api";

const AddTodoForm = () => {
  const [title, setTitle] = useState("");

  const utils = api.useUtils();

  const createTodo = api.todo.create.useMutation({
    onSuccess: () => {
      void utils.todo.getAll.invalidate();
    },
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title) return alert("Title Required!");

    try {
      await createTodo.mutateAsync({
        title,
      });

      setTitle("");
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(`Fail to create ${error.message}`);
      }
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex max-w-[500px] flex-col gap-2"
      >
        <label htmlFor="add-todo-input">Add Todo</label>
        <div className="flex gap-4">
          <input
            id="add-todo-input"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-gray-200 px-4 py-2"
          />
          <button
            type="submit"
            className="bg-blue-500 px-3 py-2 text-sm text-white hover:brightness-90"
          >
            Add
          </button>
        </div>
      </form>
    </>
  );
};

export default AddTodoForm;
