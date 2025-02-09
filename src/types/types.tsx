// src/types/types.ts

export type Field = {
    label?: string;
    type: string;
    placeholder?: string;
  };
  
  export type Exercise = {
    exerciseName: string;
    fields: Field[];
  };
  
  export type WorkoutPlan = {
    id: string;
    name: string;
    exercises: Exercise[];
  };