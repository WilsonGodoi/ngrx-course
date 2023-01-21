import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { catchError, concatMap, map } from "rxjs/operators";
import { AppState } from "../reducers";
import { CourseActions } from "./actions-types";
import { allCoursesLoaded, courseUpdatedRollback } from "./course.actions";
import { CoursesHttpService } from "./services/courses-http.service";

@Injectable()
export class CoursesEffects {
  loadCourses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CourseActions.loadAllCourses),
      concatMap((action) => this.coursesHttpService.findAllCourses()),
      map((courses) => allCoursesLoaded({ courses }))
    )
  );

  saveCourse$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CourseActions.courseUpdated),
        concatMap((action) =>
          this.coursesHttpService
            .saveCourse(action.update.id, action.update.changes)
            .pipe(
              catchError((err) => {
                this.store.dispatch(
                  courseUpdatedRollback({ update: action.courseOrigin })
                );
                return err;
              })
            )
        )
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private coursesHttpService: CoursesHttpService,
    private store: Store<AppState>
  ) {}
}
