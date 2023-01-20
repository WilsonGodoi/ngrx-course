import { createEntityAdapter, EntityState } from "@ngrx/entity";
import { createReducer, on } from "@ngrx/store";
import { CourseActions } from "../actions-types";
import { Course } from "../model/course";

export const coursesFeatureKey = "courses";

export interface CoursesState extends EntityState<Course> {}

export const adapter = createEntityAdapter<Course>();

export const initialCoursesState = adapter.getInitialState();

export const coursesReducer = createReducer(
  initialCoursesState,
  on(CourseActions.allCoursesLoaded, (state, action) =>
    adapter.setAll(action.courses, state)
  )
);
