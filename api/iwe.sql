--
-- PostgreSQL database dump
--

-- Dumped from database version 13.9 (Ubuntu 13.9-1.pgdg22.04+1)
-- Dumped by pg_dump version 13.9 (Ubuntu 13.9-1.pgdg22.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: archive_request; Type: TABLE; Schema: public; Owner: chabi
--

CREATE TABLE public.archive_request (
    id integer NOT NULL,
    contents character varying NOT NULL,
    state character varying NOT NULL,
    type_archivage character varying NOT NULL,
    firstname character varying NOT NULL,
    lastname character varying NOT NULL,
    email character varying NOT NULL,
    date_request character varying NOT NULL,
    "teacherId" integer,
    establishment integer NOT NULL
);


ALTER TABLE public.archive_request OWNER TO chabi;

--
-- Name: archive_request_id_seq; Type: SEQUENCE; Schema: public; Owner: chabi
--

CREATE SEQUENCE public.archive_request_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.archive_request_id_seq OWNER TO chabi;

--
-- Name: archive_request_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: chabi
--

ALTER SEQUENCE public.archive_request_id_seq OWNED BY public.archive_request.id;


--
-- Name: class; Type: TABLE; Schema: public; Owner: chabi
--

CREATE TABLE public.class (
    id integer NOT NULL,
    name character varying NOT NULL,
    "etablishmentId" integer
);


ALTER TABLE public.class OWNER TO chabi;

--
-- Name: class_id_seq; Type: SEQUENCE; Schema: public; Owner: chabi
--

CREATE SEQUENCE public.class_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.class_id_seq OWNER TO chabi;

--
-- Name: class_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: chabi
--

ALTER SEQUENCE public.class_id_seq OWNED BY public.class.id;


--
-- Name: establishment; Type: TABLE; Schema: public; Owner: chabi
--

CREATE TABLE public.establishment (
    id integer NOT NULL,
    name character varying NOT NULL,
    "yearId" integer
);


ALTER TABLE public.establishment OWNER TO chabi;

--
-- Name: establishment_id_seq; Type: SEQUENCE; Schema: public; Owner: chabi
--

CREATE SEQUENCE public.establishment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.establishment_id_seq OWNER TO chabi;

--
-- Name: establishment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: chabi
--

ALTER SEQUENCE public.establishment_id_seq OWNED BY public.establishment.id;


--
-- Name: information; Type: TABLE; Schema: public; Owner: chabi
--

CREATE TABLE public.information (
    id integer NOT NULL,
    contents character varying NOT NULL,
    access character varying NOT NULL,
    destinataires integer[] NOT NULL,
    "teacherId" integer,
    establishment integer NOT NULL
);


ALTER TABLE public.information OWNER TO chabi;

--
-- Name: information_id_seq; Type: SEQUENCE; Schema: public; Owner: chabi
--

CREATE SEQUENCE public.information_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.information_id_seq OWNER TO chabi;

--
-- Name: information_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: chabi
--

ALTER SEQUENCE public.information_id_seq OWNED BY public.information.id;


--
-- Name: program; Type: TABLE; Schema: public; Owner: chabi
--

CREATE TABLE public.program (
    id integer NOT NULL,
    subject character varying NOT NULL,
    date character varying NOT NULL,
    classe character varying NOT NULL,
    access character varying NOT NULL,
    destinataires integer[] NOT NULL,
    "teacherId" integer,
    establishment integer NOT NULL
);


ALTER TABLE public.program OWNER TO chabi;

--
-- Name: program_id_seq; Type: SEQUENCE; Schema: public; Owner: chabi
--

CREATE SEQUENCE public.program_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.program_id_seq OWNER TO chabi;

--
-- Name: program_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: chabi
--

ALTER SEQUENCE public.program_id_seq OWNED BY public.program.id;


--
-- Name: schedule; Type: TABLE; Schema: public; Owner: chabi
--

CREATE TABLE public.schedule (
    id integer NOT NULL,
    schedule jsonb NOT NULL,
    "classeId" integer,
    "yearId" integer
);


ALTER TABLE public.schedule OWNER TO chabi;

--
-- Name: schedule_id_seq; Type: SEQUENCE; Schema: public; Owner: chabi
--

CREATE SEQUENCE public.schedule_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.schedule_id_seq OWNER TO chabi;

--
-- Name: schedule_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: chabi
--

ALTER SEQUENCE public.schedule_id_seq OWNED BY public.schedule.id;


--
-- Name: session; Type: TABLE; Schema: public; Owner: chabi
--

CREATE TABLE public.session (
    id integer NOT NULL,
    date character varying NOT NULL,
    start_time character varying NOT NULL,
    end_time character varying NOT NULL,
    title character varying NOT NULL,
    description character varying NOT NULL,
    annex_document character varying NOT NULL,
    summary_course character varying NOT NULL,
    point_of_presence character varying NOT NULL,
    "subjectSubjectId" integer,
    "textbookId" integer,
    duration integer NOT NULL,
    "subjectClasseId" integer
);


ALTER TABLE public.session OWNER TO chabi;

--
-- Name: session_id_seq; Type: SEQUENCE; Schema: public; Owner: chabi
--

CREATE SEQUENCE public.session_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.session_id_seq OWNER TO chabi;

--
-- Name: session_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: chabi
--

ALTER SEQUENCE public.session_id_seq OWNED BY public.session.id;


--
-- Name: subject; Type: TABLE; Schema: public; Owner: chabi
--

CREATE TABLE public.subject (
    "subjectId" integer NOT NULL,
    name character varying NOT NULL,
    "teacherId" integer,
    "classeId" integer NOT NULL,
    quota_hours integer NOT NULL,
    hourly_billing integer NOT NULL
);


ALTER TABLE public.subject OWNER TO chabi;

--
-- Name: subject_ets; Type: TABLE; Schema: public; Owner: chabi
--

CREATE TABLE public.subject_ets (
    id integer NOT NULL,
    name character varying NOT NULL,
    "etablishmentId" integer
);


ALTER TABLE public.subject_ets OWNER TO chabi;

--
-- Name: subject_ets_id_seq; Type: SEQUENCE; Schema: public; Owner: chabi
--

CREATE SEQUENCE public.subject_ets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.subject_ets_id_seq OWNER TO chabi;

--
-- Name: subject_ets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: chabi
--

ALTER SEQUENCE public.subject_ets_id_seq OWNED BY public.subject_ets.id;


--
-- Name: task; Type: TABLE; Schema: public; Owner: chabi
--

CREATE TABLE public.task (
    id integer NOT NULL,
    name character varying NOT NULL,
    title character varying NOT NULL,
    date_given character varying NOT NULL,
    date_submission character varying NOT NULL,
    statement character varying NOT NULL,
    document_annex character varying NOT NULL,
    type character varying NOT NULL,
    "createdAt" character varying NOT NULL,
    "sessionId" integer
);


ALTER TABLE public.task OWNER TO chabi;

--
-- Name: task_id_seq; Type: SEQUENCE; Schema: public; Owner: chabi
--

CREATE SEQUENCE public.task_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.task_id_seq OWNER TO chabi;

--
-- Name: task_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: chabi
--

ALTER SEQUENCE public.task_id_seq OWNED BY public.task.id;


--
-- Name: teacher; Type: TABLE; Schema: public; Owner: chabi
--

CREATE TABLE public.teacher (
    id integer NOT NULL,
    "lastName" character varying(300) NOT NULL,
    "firstName" character varying(300) NOT NULL,
    email character varying(300) NOT NULL,
    "hashPassword" character varying(300) NOT NULL,
    phone character varying(300) NOT NULL,
    role character varying(300) NOT NULL
);


ALTER TABLE public.teacher OWNER TO chabi;

--
-- Name: teacher_ets; Type: TABLE; Schema: public; Owner: chabi
--

CREATE TABLE public.teacher_ets (
    "teacherId" integer NOT NULL,
    "establishmentId" integer NOT NULL,
    role character varying NOT NULL
);


ALTER TABLE public.teacher_ets OWNER TO chabi;

--
-- Name: teacher_id_seq; Type: SEQUENCE; Schema: public; Owner: chabi
--

CREATE SEQUENCE public.teacher_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.teacher_id_seq OWNER TO chabi;

--
-- Name: teacher_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: chabi
--

ALTER SEQUENCE public.teacher_id_seq OWNED BY public.teacher.id;


--
-- Name: textbook; Type: TABLE; Schema: public; Owner: chabi
--

CREATE TABLE public.textbook (
    id integer NOT NULL,
    title character varying NOT NULL,
    "classeId" integer,
    "yearAcademicId" integer
);


ALTER TABLE public.textbook OWNER TO chabi;

--
-- Name: textbook_id_seq; Type: SEQUENCE; Schema: public; Owner: chabi
--

CREATE SEQUENCE public.textbook_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.textbook_id_seq OWNER TO chabi;

--
-- Name: textbook_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: chabi
--

ALTER SEQUENCE public.textbook_id_seq OWNED BY public.textbook.id;


--
-- Name: year_academic; Type: TABLE; Schema: public; Owner: chabi
--

CREATE TABLE public.year_academic (
    id integer NOT NULL,
    year character varying NOT NULL
);


ALTER TABLE public.year_academic OWNER TO chabi;

--
-- Name: year_academic_id_seq; Type: SEQUENCE; Schema: public; Owner: chabi
--

CREATE SEQUENCE public.year_academic_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.year_academic_id_seq OWNER TO chabi;

--
-- Name: year_academic_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: chabi
--

ALTER SEQUENCE public.year_academic_id_seq OWNED BY public.year_academic.id;


--
-- Name: archive_request id; Type: DEFAULT; Schema: public; Owner: chabi
--

ALTER TABLE ONLY public.archive_request ALTER COLUMN id SET DEFAULT nextval('public.archive_request_id_seq'::regclass);


--
-- Name: class id; Type: DEFAULT; Schema: public; Owner: chabi
--

ALTER TABLE ONLY public.class ALTER COLUMN id SET DEFAULT nextval('public.class_id_seq'::regclass);


--
-- Name: establishment id; Type: DEFAULT; Schema: public; Owner: chabi
--

ALTER TABLE ONLY public.establishment ALTER COLUMN id SET DEFAULT nextval('public.establishment_id_seq'::regclass);


--
-- Name: information id; Type: DEFAULT; Schema: public; Owner: chabi
--

ALTER TABLE ONLY public.information ALTER COLUMN id SET DEFAULT nextval('public.information_id_seq'::regclass);


--
-- Name: program id; Type: DEFAULT; Schema: public; Owner: chabi
--

ALTER TABLE ONLY public.program ALTER COLUMN id SET DEFAULT nextval('public.program_id_seq'::regclass);


--
-- Name: schedule id; Type: DEFAULT; Schema: public; Owner: chabi
--

ALTER TABLE ONLY public.schedule ALTER COLUMN id SET DEFAULT nextval('public.schedule_id_seq'::regclass);


--
-- Name: session id; Type: DEFAULT; Schema: public; Owner: chabi
--

ALTER TABLE ONLY public.session ALTER COLUMN id SET DEFAULT nextval('public.session_id_seq'::regclass);


--
-- Name: subject_ets id; Type: DEFAULT; Schema: public; Owner: chabi
--

ALTER TABLE ONLY public.subject_ets ALTER COLUMN id SET DEFAULT nextval('public.subject_ets_id_seq'::regclass);


--
-- Name: task id; Type: DEFAULT; Schema: public; Owner: chabi
--

ALTER TABLE ONLY public.task ALTER COLUMN id SET DEFAULT nextval('public.task_id_seq'::regclass);


--
-- Name: teacher id; Type: DEFAULT; Schema: public; Owner: chabi
--

ALTER TABLE ONLY public.teacher ALTER COLUMN id SET DEFAULT nextval('public.teacher_id_seq'::regclass);


--
-- Name: textbook id; Type: DEFAULT; Schema: public; Owner: chabi
--

ALTER TABLE ONLY public.textbook ALTER COLUMN id SET DEFAULT nextval('public.textbook_id_seq'::regclass);


--
-- Name: year_academic id; Type: DEFAULT; Schema: public; Owner: chabi
--

ALTER TABLE ONLY public.year_academic ALTER COLUMN id SET DEFAULT nextval('public.year_academic_id_seq'::regclass);


--
-- Data for Name: archive_request; Type: TABLE DATA; Schema: public; Owner: chabi
--

COPY public.archive_request (id, contents, state, type_archivage, firstname, lastname, email, date_request, "teacherId", establishment) FROM stdin;
\.


--
-- Data for Name: class; Type: TABLE DATA; Schema: public; Owner: chabi
--

COPY public.class (id, name, "etablishmentId") FROM stdin;
7	6èmeB	7
8	5èmeB	7
\.


--
-- Data for Name: establishment; Type: TABLE DATA; Schema: public; Owner: chabi
--

COPY public.establishment (id, name, "yearId") FROM stdin;
7	Anavié	2
\.


--
-- Data for Name: information; Type: TABLE DATA; Schema: public; Owner: chabi
--

COPY public.information (id, contents, access, destinataires, "teacherId", establishment) FROM stdin;
1	Bonsoir chers colègues nous auront un conseil demain.	ALL-TEACHERS	{}	2	4
2	Bonsoir chers colègues nous auront un conseil demain.	GROUP-TEACHERS	{4,2}	2	4
3	Bonsoir chers colègues nous auront un conseil demain.	GROUP-TEACHERS	{4}	2	4
4	Bonsoir chers colègues nous auront un conseil demain.	GROUP-TEACHERS	{4}	2	4
5	Bonsoir chers colègues nous auront un conseil demain.	ALL-TEACHERS	{}	2	4
\.


--
-- Data for Name: program; Type: TABLE DATA; Schema: public; Owner: chabi
--

COPY public.program (id, subject, date, classe, access, destinataires, "teacherId", establishment) FROM stdin;
3	Travaux dirigés 4èmeB	27-10-2022	4èmeB	GROUP-TEACHERS	{4}	2	4
\.


--
-- Data for Name: schedule; Type: TABLE DATA; Schema: public; Owner: chabi
--

COPY public.schedule (id, schedule, "classeId", "yearId") FROM stdin;
1	{"Friday": [], "Monday": [{"slices": "08h-10h", "subject": "PCT", "id_subject": 2}, {"slices": "10h-12h", "subject": "SVT", "id_subject": 3}], "Sunday": [], "Tuesday": [], "Saturday": [], "Thursday": [], "Wednesday": []}	7	2
\.


--
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: chabi
--

COPY public.session (id, date, start_time, end_time, title, description, annex_document, summary_course, point_of_presence, "subjectSubjectId", "textbookId", duration, "subjectClasseId") FROM stdin;
\.


--
-- Data for Name: subject; Type: TABLE DATA; Schema: public; Owner: chabi
--

COPY public.subject ("subjectId", name, "teacherId", "classeId", quota_hours, hourly_billing) FROM stdin;
3	SVT	5	7	48	1500
2	PCT	4	7	48	1500
2	PCT	2	8	48	1500
\.


--
-- Data for Name: subject_ets; Type: TABLE DATA; Schema: public; Owner: chabi
--

COPY public.subject_ets (id, name, "etablishmentId") FROM stdin;
2	PCT	7
3	SVT	7
\.


--
-- Data for Name: task; Type: TABLE DATA; Schema: public; Owner: chabi
--

COPY public.task (id, name, title, date_given, date_submission, statement, document_annex, type, "createdAt", "sessionId") FROM stdin;
\.


--
-- Data for Name: teacher; Type: TABLE DATA; Schema: public; Owner: chabi
--

COPY public.teacher (id, "lastName", "firstName", email, "hashPassword", phone, role) FROM stdin;
1	CHABI BOUKARI	Fawaz	boukarifawaz27@gmail.com	$2b$10$Tvxk02izcXdubr5K/gmrYOuElmPkCQM2OAqVKHCoAWSVC7rIzTxDe	95661715	admin
2	CHABI BOUKARI	Fawaz	fawaz.chabi@imsp-uac.org	$2b$10$fBmoUAB7kdVl8AjbdAYujuyui3iRO84Fnmo/HuHl1hYOS56EBFBsO	95661715	user
4	ODJO	Mike Ludosky	mike.odjo@imsp-uac.org	test	95661715	user
5	AMADOU	Ruchdane	ruchdane.amadou@imsp-uac.org	$2b$10$E.FUdSIjBBb25Z76E/vTF.eXL8fc.ZFxF0eAZjiUQ6TZ30vtUvTv6	95661715	user
6	AMADOU	konite	konite.amadou@imsp-uac.org	$2b$10$H5IAzlNvCpxOiKII3/d1HOUUUmWkjqqeMMsL3u7pz0oV56xAQceNy	95661715	user
\.


--
-- Data for Name: teacher_ets; Type: TABLE DATA; Schema: public; Owner: chabi
--

COPY public.teacher_ets ("teacherId", "establishmentId", role) FROM stdin;
4	7	teacher
2	7	director
5	7	censor
\.


--
-- Data for Name: textbook; Type: TABLE DATA; Schema: public; Owner: chabi
--

COPY public.textbook (id, title, "classeId", "yearAcademicId") FROM stdin;
4	Textbook - 6èmeB - 2020-2021	7	2
5	Textbook - 6èmeB - 2021-2022	7	1
\.


--
-- Data for Name: year_academic; Type: TABLE DATA; Schema: public; Owner: chabi
--

COPY public.year_academic (id, year) FROM stdin;
1	2021-2022
2	2020-2021
\.


--
-- Name: archive_request_id_seq; Type: SEQUENCE SET; Schema: public; Owner: chabi
--

SELECT pg_catalog.setval('public.archive_request_id_seq', 1, true);


--
-- Name: class_id_seq; Type: SEQUENCE SET; Schema: public; Owner: chabi
--

SELECT pg_catalog.setval('public.class_id_seq', 8, true);


--
-- Name: establishment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: chabi
--

SELECT pg_catalog.setval('public.establishment_id_seq', 7, true);


--
-- Name: information_id_seq; Type: SEQUENCE SET; Schema: public; Owner: chabi
--

SELECT pg_catalog.setval('public.information_id_seq', 5, true);


--
-- Name: program_id_seq; Type: SEQUENCE SET; Schema: public; Owner: chabi
--

SELECT pg_catalog.setval('public.program_id_seq', 3, true);


--
-- Name: schedule_id_seq; Type: SEQUENCE SET; Schema: public; Owner: chabi
--

SELECT pg_catalog.setval('public.schedule_id_seq', 1, true);


--
-- Name: session_id_seq; Type: SEQUENCE SET; Schema: public; Owner: chabi
--

SELECT pg_catalog.setval('public.session_id_seq', 13, true);


--
-- Name: subject_ets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: chabi
--

SELECT pg_catalog.setval('public.subject_ets_id_seq', 3, true);


--
-- Name: task_id_seq; Type: SEQUENCE SET; Schema: public; Owner: chabi
--

SELECT pg_catalog.setval('public.task_id_seq', 1, true);


--
-- Name: teacher_id_seq; Type: SEQUENCE SET; Schema: public; Owner: chabi
--

SELECT pg_catalog.setval('public.teacher_id_seq', 6, true);


--
-- Name: textbook_id_seq; Type: SEQUENCE SET; Schema: public; Owner: chabi
--

SELECT pg_catalog.setval('public.textbook_id_seq', 5, true);


--
-- Name: year_academic_id_seq; Type: SEQUENCE SET; Schema: public; Owner: chabi
--

SELECT pg_catalog.setval('public.year_academic_id_seq', 2, true);


--
-- Name: information PK_091c910b61c3170a50eaf22e0c4; Type: CONSTRAINT; Schema: public; Owner: chabi
--

ALTER TABLE ONLY public.information
    ADD CONSTRAINT "PK_091c910b61c3170a50eaf22e0c4" PRIMARY KEY (id);


--
-- Name: class PK_0b9024d21bdfba8b1bd1c300eae; Type: CONSTRAINT; Schema: public; Owner: chabi
--

ALTER TABLE ONLY public.class
    ADD CONSTRAINT "PK_0b9024d21bdfba8b1bd1c300eae" PRIMARY KEY (id);


--
-- Name: establishment PK_149bd9dc1f2bd4e825a0c474932; Type: CONSTRAINT; Schema: public; Owner: chabi
--

ALTER TABLE ONLY public.establishment
    ADD CONSTRAINT "PK_149bd9dc1f2bd4e825a0c474932" PRIMARY KEY (id);


--
-- Name: schedule PK_1c05e42aec7371641193e180046; Type: CONSTRAINT; Schema: public; Owner: chabi
--

ALTER TABLE ONLY public.schedule
    ADD CONSTRAINT "PK_1c05e42aec7371641193e180046" PRIMARY KEY (id);


--
-- Name: teacher PK_2f807294148612a9751dacf1026; Type: CONSTRAINT; Schema: public; Owner: chabi
--

ALTER TABLE ONLY public.teacher
    ADD CONSTRAINT "PK_2f807294148612a9751dacf1026" PRIMARY KEY (id);


--
-- Name: program PK_3bade5945afbafefdd26a3a29fb; Type: CONSTRAINT; Schema: public; Owner: chabi
--

ALTER TABLE ONLY public.program
    ADD CONSTRAINT "PK_3bade5945afbafefdd26a3a29fb" PRIMARY KEY (id);


--
-- Name: teacher_ets PK_4fd076a76c75e230002f1ae87ec; Type: CONSTRAINT; Schema: public; Owner: chabi
--

ALTER TABLE ONLY public.teacher_ets
    ADD CONSTRAINT "PK_4fd076a76c75e230002f1ae87ec" PRIMARY KEY ("teacherId", "establishmentId", role);


--
-- Name: year_academic PK_5b5e51d76c46855f7171fd9f193; Type: CONSTRAINT; Schema: public; Owner: chabi
--

ALTER TABLE ONLY public.year_academic
    ADD CONSTRAINT "PK_5b5e51d76c46855f7171fd9f193" PRIMARY KEY (id);


--
-- Name: archive_request PK_6c0a74e1a614c61284db60e6604; Type: CONSTRAINT; Schema: public; Owner: chabi
--

ALTER TABLE ONLY public.archive_request
    ADD CONSTRAINT "PK_6c0a74e1a614c61284db60e6604" PRIMARY KEY (id);


--
-- Name: subject PK_b416a980df38661c81e27472f69; Type: CONSTRAINT; Schema: public; Owner: chabi
--

ALTER TABLE ONLY public.subject
    ADD CONSTRAINT "PK_b416a980df38661c81e27472f69" PRIMARY KEY ("subjectId", "classeId");


--
-- Name: textbook PK_d5bbc21206c0b046124f176e23e; Type: CONSTRAINT; Schema: public; Owner: chabi
--

ALTER TABLE ONLY public.textbook
    ADD CONSTRAINT "PK_d5bbc21206c0b046124f176e23e" PRIMARY KEY (id);


--
-- Name: session PK_f55da76ac1c3ac420f444d2ff11; Type: CONSTRAINT; Schema: public; Owner: chabi
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY (id);


--
-- Name: subject_ets PK_fac8b660b738ecee53608311f96; Type: CONSTRAINT; Schema: public; Owner: chabi
--

ALTER TABLE ONLY public.subject_ets
    ADD CONSTRAINT "PK_fac8b660b738ecee53608311f96" PRIMARY KEY (id);


--
-- Name: task PK_fb213f79ee45060ba925ecd576e; Type: CONSTRAINT; Schema: public; Owner: chabi
--

ALTER TABLE ONLY public.task
    ADD CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY (id);


--
-- Name: schedule REL_e1d65c8e24dd1bcf8468f411e5; Type: CONSTRAINT; Schema: public; Owner: chabi
--

ALTER TABLE ONLY public.schedule
    ADD CONSTRAINT "REL_e1d65c8e24dd1bcf8468f411e5" UNIQUE ("classeId");


--
-- Name: teacher UQ_00634394dce7677d531749ed8e8; Type: CONSTRAINT; Schema: public; Owner: chabi
--

ALTER TABLE ONLY public.teacher
    ADD CONSTRAINT "UQ_00634394dce7677d531749ed8e8" UNIQUE (email);


--
-- Name: teacher_ets FK_014b47fac774e4eb1699280d956; Type: FK CONSTRAINT; Schema: public; Owner: chabi
--

ALTER TABLE ONLY public.teacher_ets
    ADD CONSTRAINT "FK_014b47fac774e4eb1699280d956" FOREIGN KEY ("establishmentId") REFERENCES public.establishment(id) ON DELETE CASCADE;


--
-- Name: information FK_0fe829e2c8d3e75dc44a1385c01; Type: FK CONSTRAINT; Schema: public; Owner: chabi
--

ALTER TABLE ONLY public.information
    ADD CONSTRAINT "FK_0fe829e2c8d3e75dc44a1385c01" FOREIGN KEY ("teacherId") REFERENCES public.teacher(id) ON DELETE CASCADE;


--
-- Name: task FK_1ef8d4a87be0c3dc849f1d5685a; Type: FK CONSTRAINT; Schema: public; Owner: chabi
--

ALTER TABLE ONLY public.task
    ADD CONSTRAINT "FK_1ef8d4a87be0c3dc849f1d5685a" FOREIGN KEY ("sessionId") REFERENCES public.session(id);


--
-- Name: subject FK_3f443813fabb7e4cb8695777dc2; Type: FK CONSTRAINT; Schema: public; Owner: chabi
--

ALTER TABLE ONLY public.subject
    ADD CONSTRAINT "FK_3f443813fabb7e4cb8695777dc2" FOREIGN KEY ("subjectId") REFERENCES public.subject_ets(id) ON DELETE CASCADE;


--
-- Name: subject FK_48cd9a23912fb4d5ad3b1b90ff1; Type: FK CONSTRAINT; Schema: public; Owner: chabi
--

ALTER TABLE ONLY public.subject
    ADD CONSTRAINT "FK_48cd9a23912fb4d5ad3b1b90ff1" FOREIGN KEY ("teacherId") REFERENCES public.teacher(id);


--
-- Name: establishment FK_526c68e8fec781d57054fd32875; Type: FK CONSTRAINT; Schema: public; Owner: chabi
--

ALTER TABLE ONLY public.establishment
    ADD CONSTRAINT "FK_526c68e8fec781d57054fd32875" FOREIGN KEY ("yearId") REFERENCES public.year_academic(id) ON DELETE CASCADE;


--
-- Name: subject_ets FK_533d06dba193c1f82ff7bc1f15e; Type: FK CONSTRAINT; Schema: public; Owner: chabi
--

ALTER TABLE ONLY public.subject_ets
    ADD CONSTRAINT "FK_533d06dba193c1f82ff7bc1f15e" FOREIGN KEY ("etablishmentId") REFERENCES public.establishment(id) ON DELETE CASCADE;


--
-- Name: program FK_5c943956268fd6e5a4bd20bf47c; Type: FK CONSTRAINT; Schema: public; Owner: chabi
--

ALTER TABLE ONLY public.program
    ADD CONSTRAINT "FK_5c943956268fd6e5a4bd20bf47c" FOREIGN KEY ("teacherId") REFERENCES public.teacher(id) ON DELETE CASCADE;


--
-- Name: teacher_ets FK_869a0aecff92d6a37c441dab09c; Type: FK CONSTRAINT; Schema: public; Owner: chabi
--

ALTER TABLE ONLY public.teacher_ets
    ADD CONSTRAINT "FK_869a0aecff92d6a37c441dab09c" FOREIGN KEY ("teacherId") REFERENCES public.teacher(id) ON DELETE CASCADE;


--
-- Name: textbook FK_8fbf9724416e881c30bca768a6f; Type: FK CONSTRAINT; Schema: public; Owner: chabi
--

ALTER TABLE ONLY public.textbook
    ADD CONSTRAINT "FK_8fbf9724416e881c30bca768a6f" FOREIGN KEY ("classeId") REFERENCES public.class(id) ON DELETE CASCADE;


--
-- Name: archive_request FK_a19524654435ed681ba9a5d069b; Type: FK CONSTRAINT; Schema: public; Owner: chabi
--

ALTER TABLE ONLY public.archive_request
    ADD CONSTRAINT "FK_a19524654435ed681ba9a5d069b" FOREIGN KEY ("teacherId") REFERENCES public.teacher(id) ON DELETE CASCADE;


--
-- Name: class FK_c034003a8f85df0968b523a054f; Type: FK CONSTRAINT; Schema: public; Owner: chabi
--

ALTER TABLE ONLY public.class
    ADD CONSTRAINT "FK_c034003a8f85df0968b523a054f" FOREIGN KEY ("etablishmentId") REFERENCES public.establishment(id) ON DELETE CASCADE;


--
-- Name: schedule FK_c493d70b56ded25b2937c87faf9; Type: FK CONSTRAINT; Schema: public; Owner: chabi
--

ALTER TABLE ONLY public.schedule
    ADD CONSTRAINT "FK_c493d70b56ded25b2937c87faf9" FOREIGN KEY ("yearId") REFERENCES public.year_academic(id) ON DELETE CASCADE;


--
-- Name: textbook FK_c700b8a428cb639f3db271279b3; Type: FK CONSTRAINT; Schema: public; Owner: chabi
--

ALTER TABLE ONLY public.textbook
    ADD CONSTRAINT "FK_c700b8a428cb639f3db271279b3" FOREIGN KEY ("yearAcademicId") REFERENCES public.year_academic(id) ON DELETE CASCADE;


--
-- Name: session FK_d0731b0749e87b72e81e5ab7fe0; Type: FK CONSTRAINT; Schema: public; Owner: chabi
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT "FK_d0731b0749e87b72e81e5ab7fe0" FOREIGN KEY ("subjectSubjectId", "subjectClasseId") REFERENCES public.subject("subjectId", "classeId") ON DELETE CASCADE;


--
-- Name: subject FK_d7d87d324e59f80a991cc007bd7; Type: FK CONSTRAINT; Schema: public; Owner: chabi
--

ALTER TABLE ONLY public.subject
    ADD CONSTRAINT "FK_d7d87d324e59f80a991cc007bd7" FOREIGN KEY ("classeId") REFERENCES public.class(id) ON DELETE CASCADE;


--
-- Name: session FK_e11ecc5a06dea22ff6e8a5991f8; Type: FK CONSTRAINT; Schema: public; Owner: chabi
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT "FK_e11ecc5a06dea22ff6e8a5991f8" FOREIGN KEY ("textbookId") REFERENCES public.textbook(id) ON DELETE CASCADE;


--
-- Name: schedule FK_e1d65c8e24dd1bcf8468f411e5b; Type: FK CONSTRAINT; Schema: public; Owner: chabi
--

ALTER TABLE ONLY public.schedule
    ADD CONSTRAINT "FK_e1d65c8e24dd1bcf8468f411e5b" FOREIGN KEY ("classeId") REFERENCES public.class(id);


--
-- PostgreSQL database dump complete
--

