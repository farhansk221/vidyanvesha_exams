export const API_CONTS = {
    EXAM_SESSIONS: {
        LIST: "/exam-sessions/",
        CREATE: "/exam-sessions/",
        UPDATE: "/exam-sessions/:id/",
        DELETE: "/exam-sessions/:id/",
        DETAILS: "/exam-sessions/:id/",
        COMBINATIONS: "/exam-sessions/:id/combinations/",
        SYNC_STUDENTS: "/exam-sessions/:id/students-by-dept-prog-sem/:deptId/:progId/:semester/:classId/"
    },
    EXAMS: {
        LIST: "/exams/",
        CREATE: "/exams/",
        UPDATE: "/exams/:id/",
        DELETE: "/exams/:id/",
        DETAILS: "/exams/:id/"
    },
    EXAM_QUESTIONS: {
        LIST: "/exam-questions/",
        CREATE: "/exam-questions/",
        UPDATE: "/exam-questions/:id/",
        DELETE: "/exam-questions/:id/",
        DETAILS: "/exam-questions/:id/"
    },
    EXAM_QUESTION_MARKS_ANONYMOUS: {
        LIST: "/exam-question-marks-anonymous/",
        CREATE: "/exam-question-marks-anonymous/",
        UPDATE: "/exam-question-marks-anonymous/:id/",
        DELETE: "/exam-question-marks-anonymous/:id/",
        DETAILS: "/exam-question-marks-anonymous/:id/"
    },
    EXAM_TOTAL_MARKS_ANONYMOUS: {
        LIST: "/exam-total-marks-anonymous/",
        CREATE: "/exam-total-marks-anonymous/",
        UPDATE: "/exam-total-marks-anonymous/:id/",
        DELETE: "/exam-total-marks-anonymous/:id/",
        DETAILS: "/exam-total-marks-anonymous/:id/"
    },
    STUDENT_EXAM_QUESTION_MARKS: {
        LIST: "/student-exam-question-marks/",
        CREATE: "/student-exam-question-marks/",
        UPDATE: "/student-exam-question-marks/:id/",
        DELETE: "/student-exam-question-marks/:id/",
        DETAILS: "/student-exam-question-marks/:id/"
    },
    EXAM_QUESTION_OUTCOMES: {
        LIST: "/exam-question-outcomes/",
        CREATE: "/exam-question-outcomes/",
        UPDATE: "/exam-question-outcomes/:id/",
        DELETE: "/exam-question-outcomes/:id/",
        DETAILS: "/exam-question-outcomes/:id/"
    },
    STUDENT_EXAM_QUESTION_OUTCOMES_SCORE: {
        LIST: "/student-exam-question-outcome-scores/",
        CREATE: "/student-exam-question-outcome-scores/",
        UPDATE: "/student-exam-question-outcome-scores/:id/",
        DELETE: "/student-exam-question-outcome-scores/:id/",
        DETAILS: "/student-exam-question-outcome-scores/:id/"
    },
    EXAM_OUTCOMES: {
        LIST: "/exam-outcomes/",
        CREATE: "/exam-outcomes/",
        UPDATE: "/exam-outcomes/:id/",
        DELETE: "/exam-outcomes/:id/",
        DETAILS: "/exam-outcomes/:id/"
    },
    STUDENT_EXAM_OUTCOME_SCORE: {
        LIST: "/student-exam-outcome-scores/",
        CREATE: "/student-exam-outcome-scores/",
        UPDATE: "/student-exam-outcome-scores/:id/",
        DELETE: "/student-exam-outcome-scores/:id/",
        DETAILS: "/student-exam-outcome-scores/:id/"
    },
    QUESTION_PAPERS: {
        LIST: "/question-papers/",
        CREATE: "/question-papers/",
        UPDATE: "/question-papers/:id/",
        DELETE: "/question-papers/:id/",
        DETAILS: "/question-papers/:id/"
    },
    QUESTION_PAPER_QUESTIONS: {
        LIST: "/question-paper-questions/",
        CREATE: "/question-paper-questions/",
        UPDATE: "/question-paper-questions/:id/",
        DELETE: "/question-paper-questions/:id/",
        DETAILS: "/question-paper-questions/:id/"
    },
    EXAM_QUESTION_PAPER: {
        LIST: "/exam-question-paper/",
        CREATE: "/exam-question-paper/",
        UPDATE: "/exam-question-paper/:id/",
        DELETE: "/exam-question-paper/:id/",
        DETAILS: "/exam-question-paper/:id/"
    },
    EXAM_SESSION_SEMESTER_PROGRAM_COURSE_STUDENT: {
        LIST: "/exam-session-semester-program-course-student/",
        CREATE: "/exam-session-semester-program-course-student/",
        UPDATE: "/exam-session-semester-program-course-student/:id/",
        DELETE: "/exam-session-semester-program-course-student/:id/",
        DETAILS: "/exam-session-semester-program-course-student/:id/"
    },
    EXAM_SESSION_STUDENT: {
        LIST: "/exam-session-student/",
        CREATE: "/exam-session-student/",
        UPDATE: "/exam-session-student/:id/",
        DELETE: "/exam-session-student/:id/",
        DETAILS: "/exam-session-student/:id/"
    },
    EXAM_GRADE_STRUCTURE: {
        LIST: "/exam-grade-structure/",
        CREATE: "/exam-grade-structure/",
        UPDATE: "/exam-grade-structure/:id/",
        DELETE: "/exam-grade-structure/:id/",
        DETAILS: "/exam-grade-structure/:id/"
    }

}