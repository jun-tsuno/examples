import { type Todo } from "@prisma/client";
import React from "react";
import { api } from "~/utils/api";

interface CardProps {
  todo: Todo;
}

const Card = ({ todo }: CardProps) => {
  const { isDone } = todo;

  const utils = api.useUtils();

  const updateTodo = api.todo.update.useMutation({
    onSuccess: () => {
      void utils.todo.getAll.invalidate();
    },
  });

  const deleteTodo = api.todo.delete.useMutation({
    onSuccess: () => {
      void utils.todo.getAll.invalidate();
    },
  });

  const handleDone = async () => {
    try {
      await updateTodo.mutateAsync({
        id: todo.id,
        data: { isDone: !isDone },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(`Fail to update ${error.message}`);
      }
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTodo.mutateAsync({ id: todo.id });
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(`Fail to update ${error.message}`);
      }
    }
  };

  return (
    <>
      <div className="flex items-center justify-between rounded-xl border-[1px] px-6 py-3">
        <span>{todo.title}</span>
        <div className="flex items-center gap-3">
          <span className="font-semibold">
            {todo.isDone ? "DONE" : "UNDONE"}
          </span>
          <button
            onClick={handleDone}
            className={`flex h-8 w-8 items-center justify-center rounded-full border-[2px] hover:brightness-90 ${
              isDone
                ? "border-orange-300 bg-orange-200"
                : " border-emerald-300 bg-emerald-200"
            }`}
          >
            {isDone ? "⍻" : "✓"}
          </button>
          <button
            onClick={handleDelete}
            className="flex h-8 w-8 items-center justify-center rounded-full border-[2px] border-red-300 bg-red-200 hover:brightness-90"
          >
            🗑️
          </button>
        </div>
      </div>
    </>
  );
};

export default Card;
