PGDMP  9    4                }            postgres    17.4    17.4 o    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            �           1262    5    postgres    DATABASE     n   CREATE DATABASE postgres WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en-US';
    DROP DATABASE postgres;
                     postgres    false            �           0    0    DATABASE postgres    COMMENT     N   COMMENT ON DATABASE postgres IS 'default administrative connection database';
                        postgres    false    5004            �           1247    24701    attendance_status    TYPE     i   CREATE TYPE public.attendance_status AS ENUM (
    'present',
    'absent',
    'late',
    'excused'
);
 $   DROP TYPE public.attendance_status;
       public               postgres    false            n           1247    24580    day_of_week    TYPE     �   CREATE TYPE public.day_of_week AS ENUM (
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
);
    DROP TYPE public.day_of_week;
       public               postgres    false            w           1247    24638    hw_submission_status    TYPE     S   CREATE TYPE public.hw_submission_status AS ENUM (
    'submitted',
    'graded'
);
 '   DROP TYPE public.hw_submission_status;
       public               postgres    false            �            1259    24710 
   Attendance    TABLE     �  CREATE TABLE public."Attendance" (
    id integer NOT NULL,
    student_id integer NOT NULL,
    time_table_id integer NOT NULL,
    date date DEFAULT CURRENT_DATE NOT NULL,
    status public.attendance_status DEFAULT 'present'::public.attendance_status NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);
     DROP TABLE public."Attendance";
       public         heap r       postgres    false    896    896            �            1259    24709    Attendance_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Attendance_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public."Attendance_id_seq";
       public               postgres    false    233            �           0    0    Attendance_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public."Attendance_id_seq" OWNED BY public."Attendance".id;
          public               postgres    false    232            �            1259    16389    Class    TABLE     c   CREATE TABLE public."Class" (
    id integer NOT NULL,
    name character varying(100) NOT NULL
);
    DROP TABLE public."Class";
       public         heap r       postgres    false            �            1259    16388    Class_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Class_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public."Class_id_seq";
       public               postgres    false    218            �           0    0    Class_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public."Class_id_seq" OWNED BY public."Class".id;
          public               postgres    false    217            �            1259    24617    Homework    TABLE     �  CREATE TABLE public."Homework" (
    id integer NOT NULL,
    title character varying(200) NOT NULL,
    content text NOT NULL,
    publish_date date DEFAULT CURRENT_DATE NOT NULL,
    submission_date date NOT NULL,
    professor_id integer NOT NULL,
    class_id integer NOT NULL,
    file_name character varying(255),
    file_link text,
    total_marks integer DEFAULT 100 NOT NULL
);
    DROP TABLE public."Homework";
       public         heap r       postgres    false            �            1259    24616    Homework_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Homework_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public."Homework_id_seq";
       public               postgres    false    228            �           0    0    Homework_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public."Homework_id_seq" OWNED BY public."Homework".id;
          public               postgres    false    227            �            1259    16421 	   Professor    TABLE     �  CREATE TABLE public."Professor" (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    phone bigint NOT NULL,
    address text NOT NULL,
    email character varying(100) NOT NULL,
    password text NOT NULL,
    classes text[] NOT NULL,
    roll_no character varying,
    first_name character varying,
    last_name character varying,
    dept character varying,
    date_of_join date,
    dob date,
    photo text
);
    DROP TABLE public."Professor";
       public         heap r       postgres    false            �            1259    16420    Professor_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Professor_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public."Professor_id_seq";
       public               postgres    false    224            �           0    0    Professor_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public."Professor_id_seq" OWNED BY public."Professor".id;
          public               postgres    false    223            �            1259    16396    Student    TABLE     �  CREATE TABLE public."Student" (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    password text NOT NULL,
    phone bigint NOT NULL,
    roll_no integer NOT NULL,
    address text NOT NULL,
    photograph text,
    gender character varying(10) NOT NULL,
    age integer NOT NULL,
    blood character varying(10) NOT NULL,
    father character varying(100) NOT NULL,
    father_number bigint NOT NULL,
    occupation character varying(100) NOT NULL,
    previous_term integer NOT NULL,
    class_id integer,
    photo character varying,
    first_name text,
    last_name text,
    semester text,
    dob date,
    batch text
);
    DROP TABLE public."Student";
       public         heap r       postgres    false            �            1259    16395    Student_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Student_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public."Student_id_seq";
       public               postgres    false    220            �           0    0    Student_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public."Student_id_seq" OWNED BY public."Student".id;
          public               postgres    false    219            �            1259    24644 
   Submission    TABLE     �  CREATE TABLE public."Submission" (
    id integer NOT NULL,
    hw_id integer NOT NULL,
    student_id integer NOT NULL,
    content text,
    file_name character varying(255),
    file_link text,
    status public.hw_submission_status DEFAULT 'submitted'::public.hw_submission_status NOT NULL,
    marks integer,
    submitted_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
     DROP TABLE public."Submission";
       public         heap r       postgres    false    887    887            �            1259    24643    Submission_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Submission_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public."Submission_id_seq";
       public               postgres    false    230            �           0    0    Submission_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public."Submission_id_seq" OWNED BY public."Submission".id;
          public               postgres    false    229            �            1259    24596 	   TimeTable    TABLE     d  CREATE TABLE public."TimeTable" (
    id integer NOT NULL,
    class_id integer NOT NULL,
    professor_id integer NOT NULL,
    subject character varying(100) NOT NULL,
    room character varying(50) NOT NULL,
    day_of_the_week public.day_of_week NOT NULL,
    start_time time without time zone NOT NULL,
    end_time time without time zone NOT NULL
);
    DROP TABLE public."TimeTable";
       public         heap r       postgres    false    878            �            1259    24595    TimeTable_id_seq    SEQUENCE     �   CREATE SEQUENCE public."TimeTable_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public."TimeTable_id_seq";
       public               postgres    false    226            �           0    0    TimeTable_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public."TimeTable_id_seq" OWNED BY public."TimeTable".id;
          public               postgres    false    225            �            1259    16412    announcements    TABLE     ,  CREATE TABLE public.announcements (
    id integer NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    visibility integer DEFAULT 1 NOT NULL,
    file_name character varying(255),
    file_link text,
    professor_id integer,
    date timestamp with time zone DEFAULT now() NOT NULL
);
 !   DROP TABLE public.announcements;
       public         heap r       postgres    false            �            1259    16411    announcements_id_seq    SEQUENCE     �   CREATE SEQUENCE public.announcements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public.announcements_id_seq;
       public               postgres    false    222            �           0    0    announcements_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public.announcements_id_seq OWNED BY public.announcements.id;
          public               postgres    false    221            �            1259    24754    class_cancelled    TABLE     }   CREATE TABLE public.class_cancelled (
    id integer NOT NULL,
    date date NOT NULL,
    time_table_id integer NOT NULL
);
 #   DROP TABLE public.class_cancelled;
       public         heap r       postgres    false            �            1259    24753    class_cancelled_id_seq    SEQUENCE     �   CREATE SEQUENCE public.class_cancelled_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.class_cancelled_id_seq;
       public               postgres    false    237            �           0    0    class_cancelled_id_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.class_cancelled_id_seq OWNED BY public.class_cancelled.id;
          public               postgres    false    236            �            1259    24666    professor_class    TABLE     j   CREATE TABLE public.professor_class (
    professor_id integer NOT NULL,
    class_id integer NOT NULL
);
 #   DROP TABLE public.professor_class;
       public         heap r       postgres    false            �            1259    24736    results    TABLE     f  CREATE TABLE public.results (
    id integer NOT NULL,
    student_id integer NOT NULL,
    exam character varying(100) NOT NULL,
    subject character varying(100) NOT NULL,
    date date NOT NULL,
    marks integer NOT NULL,
    total_marks integer NOT NULL,
    semester integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);
    DROP TABLE public.results;
       public         heap r       postgres    false            �            1259    24735    results_id_seq    SEQUENCE     �   CREATE SEQUENCE public.results_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.results_id_seq;
       public               postgres    false    235            �           0    0    results_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.results_id_seq OWNED BY public.results.id;
          public               postgres    false    234            �           2604    24713    Attendance id    DEFAULT     r   ALTER TABLE ONLY public."Attendance" ALTER COLUMN id SET DEFAULT nextval('public."Attendance_id_seq"'::regclass);
 >   ALTER TABLE public."Attendance" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    233    232    233            �           2604    16392    Class id    DEFAULT     h   ALTER TABLE ONLY public."Class" ALTER COLUMN id SET DEFAULT nextval('public."Class_id_seq"'::regclass);
 9   ALTER TABLE public."Class" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    218    217    218            �           2604    24620    Homework id    DEFAULT     n   ALTER TABLE ONLY public."Homework" ALTER COLUMN id SET DEFAULT nextval('public."Homework_id_seq"'::regclass);
 <   ALTER TABLE public."Homework" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    228    227    228            �           2604    16424    Professor id    DEFAULT     p   ALTER TABLE ONLY public."Professor" ALTER COLUMN id SET DEFAULT nextval('public."Professor_id_seq"'::regclass);
 =   ALTER TABLE public."Professor" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    224    223    224            �           2604    16399 
   Student id    DEFAULT     l   ALTER TABLE ONLY public."Student" ALTER COLUMN id SET DEFAULT nextval('public."Student_id_seq"'::regclass);
 ;   ALTER TABLE public."Student" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    219    220    220            �           2604    24647    Submission id    DEFAULT     r   ALTER TABLE ONLY public."Submission" ALTER COLUMN id SET DEFAULT nextval('public."Submission_id_seq"'::regclass);
 >   ALTER TABLE public."Submission" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    230    229    230            �           2604    24599    TimeTable id    DEFAULT     p   ALTER TABLE ONLY public."TimeTable" ALTER COLUMN id SET DEFAULT nextval('public."TimeTable_id_seq"'::regclass);
 =   ALTER TABLE public."TimeTable" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    226    225    226            �           2604    16415    announcements id    DEFAULT     t   ALTER TABLE ONLY public.announcements ALTER COLUMN id SET DEFAULT nextval('public.announcements_id_seq'::regclass);
 ?   ALTER TABLE public.announcements ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    222    221    222            �           2604    24757    class_cancelled id    DEFAULT     x   ALTER TABLE ONLY public.class_cancelled ALTER COLUMN id SET DEFAULT nextval('public.class_cancelled_id_seq'::regclass);
 A   ALTER TABLE public.class_cancelled ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    236    237    237            �           2604    24739 
   results id    DEFAULT     h   ALTER TABLE ONLY public.results ALTER COLUMN id SET DEFAULT nextval('public.results_id_seq'::regclass);
 9   ALTER TABLE public.results ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    234    235    235            �          0    24710 
   Attendance 
   TABLE DATA           k   COPY public."Attendance" (id, student_id, time_table_id, date, status, created_at, updated_at) FROM stdin;
    public               postgres    false    233   r�       s          0    16389    Class 
   TABLE DATA           +   COPY public."Class" (id, name) FROM stdin;
    public               postgres    false    218   ��       }          0    24617    Homework 
   TABLE DATA           �   COPY public."Homework" (id, title, content, publish_date, submission_date, professor_id, class_id, file_name, file_link, total_marks) FROM stdin;
    public               postgres    false    228    �       y          0    16421 	   Professor 
   TABLE DATA           �   COPY public."Professor" (id, name, phone, address, email, password, classes, roll_no, first_name, last_name, dept, date_of_join, dob, photo) FROM stdin;
    public               postgres    false    224   ��       u          0    16396    Student 
   TABLE DATA           �   COPY public."Student" (id, name, email, password, phone, roll_no, address, photograph, gender, age, blood, father, father_number, occupation, previous_term, class_id, photo, first_name, last_name, semester, dob, batch) FROM stdin;
    public               postgres    false    220   ]�                 0    24644 
   Submission 
   TABLE DATA           y   COPY public."Submission" (id, hw_id, student_id, content, file_name, file_link, status, marks, submitted_at) FROM stdin;
    public               postgres    false    230   [�       {          0    24596 	   TimeTable 
   TABLE DATA           w   COPY public."TimeTable" (id, class_id, professor_id, subject, room, day_of_the_week, start_time, end_time) FROM stdin;
    public               postgres    false    226   x�       w          0    16412    announcements 
   TABLE DATA           q   COPY public.announcements (id, title, content, visibility, file_name, file_link, professor_id, date) FROM stdin;
    public               postgres    false    222   ��       �          0    24754    class_cancelled 
   TABLE DATA           B   COPY public.class_cancelled (id, date, time_table_id) FROM stdin;
    public               postgres    false    237   (�       �          0    24666    professor_class 
   TABLE DATA           A   COPY public.professor_class (professor_id, class_id) FROM stdin;
    public               postgres    false    231   E�       �          0    24736    results 
   TABLE DATA           p   COPY public.results (id, student_id, exam, subject, date, marks, total_marks, semester, created_at) FROM stdin;
    public               postgres    false    235   f�       �           0    0    Attendance_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public."Attendance_id_seq"', 1, false);
          public               postgres    false    232            �           0    0    Class_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public."Class_id_seq"', 10, true);
          public               postgres    false    217            �           0    0    Homework_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public."Homework_id_seq"', 1, true);
          public               postgres    false    227            �           0    0    Professor_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public."Professor_id_seq"', 1, true);
          public               postgres    false    223            �           0    0    Student_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public."Student_id_seq"', 7, true);
          public               postgres    false    219            �           0    0    Submission_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public."Submission_id_seq"', 1, false);
          public               postgres    false    229            �           0    0    TimeTable_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public."TimeTable_id_seq"', 1, false);
          public               postgres    false    225            �           0    0    announcements_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public.announcements_id_seq', 1, false);
          public               postgres    false    221            �           0    0    class_cancelled_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.class_cancelled_id_seq', 1, false);
          public               postgres    false    236            �           0    0    results_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.results_id_seq', 1, false);
          public               postgres    false    234            �           2606    24719    Attendance Attendance_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public."Attendance"
    ADD CONSTRAINT "Attendance_pkey" PRIMARY KEY (id);
 H   ALTER TABLE ONLY public."Attendance" DROP CONSTRAINT "Attendance_pkey";
       public                 postgres    false    233            �           2606    24721 7   Attendance Attendance_student_id_time_table_id_date_key 
   CONSTRAINT     �   ALTER TABLE ONLY public."Attendance"
    ADD CONSTRAINT "Attendance_student_id_time_table_id_date_key" UNIQUE (student_id, time_table_id, date);
 e   ALTER TABLE ONLY public."Attendance" DROP CONSTRAINT "Attendance_student_id_time_table_id_date_key";
       public                 postgres    false    233    233    233            �           2606    16394    Class Class_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public."Class"
    ADD CONSTRAINT "Class_pkey" PRIMARY KEY (id);
 >   ALTER TABLE ONLY public."Class" DROP CONSTRAINT "Class_pkey";
       public                 postgres    false    218            �           2606    24626    Homework Homework_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public."Homework"
    ADD CONSTRAINT "Homework_pkey" PRIMARY KEY (id);
 D   ALTER TABLE ONLY public."Homework" DROP CONSTRAINT "Homework_pkey";
       public                 postgres    false    228            �           2606    16430    Professor Professor_email_key 
   CONSTRAINT     ]   ALTER TABLE ONLY public."Professor"
    ADD CONSTRAINT "Professor_email_key" UNIQUE (email);
 K   ALTER TABLE ONLY public."Professor" DROP CONSTRAINT "Professor_email_key";
       public                 postgres    false    224            �           2606    16428    Professor Professor_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public."Professor"
    ADD CONSTRAINT "Professor_pkey" PRIMARY KEY (id);
 F   ALTER TABLE ONLY public."Professor" DROP CONSTRAINT "Professor_pkey";
       public                 postgres    false    224            �           2606    16405    Student Student_email_key 
   CONSTRAINT     Y   ALTER TABLE ONLY public."Student"
    ADD CONSTRAINT "Student_email_key" UNIQUE (email);
 G   ALTER TABLE ONLY public."Student" DROP CONSTRAINT "Student_email_key";
       public                 postgres    false    220            �           2606    16403    Student Student_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public."Student"
    ADD CONSTRAINT "Student_pkey" PRIMARY KEY (id);
 B   ALTER TABLE ONLY public."Student" DROP CONSTRAINT "Student_pkey";
       public                 postgres    false    220            �           2606    24655 *   Submission Submission_hw_id_student_id_key 
   CONSTRAINT     v   ALTER TABLE ONLY public."Submission"
    ADD CONSTRAINT "Submission_hw_id_student_id_key" UNIQUE (hw_id, student_id);
 X   ALTER TABLE ONLY public."Submission" DROP CONSTRAINT "Submission_hw_id_student_id_key";
       public                 postgres    false    230    230            �           2606    24653    Submission Submission_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public."Submission"
    ADD CONSTRAINT "Submission_pkey" PRIMARY KEY (id);
 H   ALTER TABLE ONLY public."Submission" DROP CONSTRAINT "Submission_pkey";
       public                 postgres    false    230            �           2606    24603 ;   TimeTable TimeTable_class_id_day_of_the_week_start_time_key 
   CONSTRAINT     �   ALTER TABLE ONLY public."TimeTable"
    ADD CONSTRAINT "TimeTable_class_id_day_of_the_week_start_time_key" UNIQUE (class_id, day_of_the_week, start_time);
 i   ALTER TABLE ONLY public."TimeTable" DROP CONSTRAINT "TimeTable_class_id_day_of_the_week_start_time_key";
       public                 postgres    false    226    226    226            �           2606    24601    TimeTable TimeTable_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public."TimeTable"
    ADD CONSTRAINT "TimeTable_pkey" PRIMARY KEY (id);
 F   ALTER TABLE ONLY public."TimeTable" DROP CONSTRAINT "TimeTable_pkey";
       public                 postgres    false    226            �           2606    16419     announcements announcements_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT announcements_pkey PRIMARY KEY (id);
 J   ALTER TABLE ONLY public.announcements DROP CONSTRAINT announcements_pkey;
       public                 postgres    false    222            �           2606    24761 6   class_cancelled class_cancelled_date_time_table_id_key 
   CONSTRAINT     �   ALTER TABLE ONLY public.class_cancelled
    ADD CONSTRAINT class_cancelled_date_time_table_id_key UNIQUE (date, time_table_id);
 `   ALTER TABLE ONLY public.class_cancelled DROP CONSTRAINT class_cancelled_date_time_table_id_key;
       public                 postgres    false    237    237            �           2606    24759 $   class_cancelled class_cancelled_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.class_cancelled
    ADD CONSTRAINT class_cancelled_pkey PRIMARY KEY (id);
 N   ALTER TABLE ONLY public.class_cancelled DROP CONSTRAINT class_cancelled_pkey;
       public                 postgres    false    237            �           2606    24670 $   professor_class professor_class_pkey 
   CONSTRAINT     v   ALTER TABLE ONLY public.professor_class
    ADD CONSTRAINT professor_class_pkey PRIMARY KEY (professor_id, class_id);
 N   ALTER TABLE ONLY public.professor_class DROP CONSTRAINT professor_class_pkey;
       public                 postgres    false    231    231            �           2606    24742    results results_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.results
    ADD CONSTRAINT results_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.results DROP CONSTRAINT results_pkey;
       public                 postgres    false    235            �           2606    24749    results uq_results_unique 
   CONSTRAINT     o   ALTER TABLE ONLY public.results
    ADD CONSTRAINT uq_results_unique UNIQUE (student_id, exam, subject, date);
 C   ALTER TABLE ONLY public.results DROP CONSTRAINT uq_results_unique;
       public                 postgres    false    235    235    235    235            �           1259    24699    idx_announcements_date    INDEX     U   CREATE INDEX idx_announcements_date ON public.announcements USING btree (date DESC);
 *   DROP INDEX public.idx_announcements_date;
       public                 postgres    false    222            �           1259    24698    idx_announcements_professor    INDEX     ]   CREATE INDEX idx_announcements_professor ON public.announcements USING btree (professor_id);
 /   DROP INDEX public.idx_announcements_professor;
       public                 postgres    false    222            �           1259    24734    idx_attendance_date    INDEX     L   CREATE INDEX idx_attendance_date ON public."Attendance" USING btree (date);
 '   DROP INDEX public.idx_attendance_date;
       public                 postgres    false    233            �           1259    24732    idx_attendance_student    INDEX     U   CREATE INDEX idx_attendance_student ON public."Attendance" USING btree (student_id);
 *   DROP INDEX public.idx_attendance_student;
       public                 postgres    false    233            �           1259    24733    idx_attendance_timetable    INDEX     Z   CREATE INDEX idx_attendance_timetable ON public."Attendance" USING btree (time_table_id);
 ,   DROP INDEX public.idx_attendance_timetable;
       public                 postgres    false    233            �           1259    24752    idx_results_date    INDEX     I   CREATE INDEX idx_results_date ON public.results USING btree (date DESC);
 $   DROP INDEX public.idx_results_date;
       public                 postgres    false    235            �           1259    24751    idx_results_semester    INDEX     L   CREATE INDEX idx_results_semester ON public.results USING btree (semester);
 (   DROP INDEX public.idx_results_semester;
       public                 postgres    false    235            �           1259    24750    idx_results_student    INDEX     M   CREATE INDEX idx_results_student ON public.results USING btree (student_id);
 '   DROP INDEX public.idx_results_student;
       public                 postgres    false    235            �           2606    24722 %   Attendance Attendance_student_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Attendance"
    ADD CONSTRAINT "Attendance_student_id_fkey" FOREIGN KEY (student_id) REFERENCES public."Student"(id) ON DELETE CASCADE;
 S   ALTER TABLE ONLY public."Attendance" DROP CONSTRAINT "Attendance_student_id_fkey";
       public               postgres    false    233    4779    220            �           2606    24727 (   Attendance Attendance_time_table_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Attendance"
    ADD CONSTRAINT "Attendance_time_table_id_fkey" FOREIGN KEY (time_table_id) REFERENCES public."TimeTable"(id) ON DELETE CASCADE;
 V   ALTER TABLE ONLY public."Attendance" DROP CONSTRAINT "Attendance_time_table_id_fkey";
       public               postgres    false    233    4791    226            �           2606    24632    Homework Homework_class_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Homework"
    ADD CONSTRAINT "Homework_class_id_fkey" FOREIGN KEY (class_id) REFERENCES public."Class"(id) ON DELETE CASCADE;
 M   ALTER TABLE ONLY public."Homework" DROP CONSTRAINT "Homework_class_id_fkey";
       public               postgres    false    228    218    4775            �           2606    24627 #   Homework Homework_professor_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Homework"
    ADD CONSTRAINT "Homework_professor_id_fkey" FOREIGN KEY (professor_id) REFERENCES public."Professor"(id) ON DELETE SET NULL;
 Q   ALTER TABLE ONLY public."Homework" DROP CONSTRAINT "Homework_professor_id_fkey";
       public               postgres    false    224    4787    228            �           2606    16406    Student Student_class_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Student"
    ADD CONSTRAINT "Student_class_id_fkey" FOREIGN KEY (class_id) REFERENCES public."Class"(id);
 K   ALTER TABLE ONLY public."Student" DROP CONSTRAINT "Student_class_id_fkey";
       public               postgres    false    220    4775    218            �           2606    24656     Submission Submission_hw_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Submission"
    ADD CONSTRAINT "Submission_hw_id_fkey" FOREIGN KEY (hw_id) REFERENCES public."Homework"(id) ON DELETE CASCADE;
 N   ALTER TABLE ONLY public."Submission" DROP CONSTRAINT "Submission_hw_id_fkey";
       public               postgres    false    228    4793    230            �           2606    24661 %   Submission Submission_student_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Submission"
    ADD CONSTRAINT "Submission_student_id_fkey" FOREIGN KEY (student_id) REFERENCES public."Student"(id) ON DELETE CASCADE;
 S   ALTER TABLE ONLY public."Submission" DROP CONSTRAINT "Submission_student_id_fkey";
       public               postgres    false    220    230    4779            �           2606    24604 !   TimeTable TimeTable_class_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."TimeTable"
    ADD CONSTRAINT "TimeTable_class_id_fkey" FOREIGN KEY (class_id) REFERENCES public."Class"(id) ON DELETE CASCADE;
 O   ALTER TABLE ONLY public."TimeTable" DROP CONSTRAINT "TimeTable_class_id_fkey";
       public               postgres    false    4775    226    218            �           2606    24609 %   TimeTable TimeTable_professor_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."TimeTable"
    ADD CONSTRAINT "TimeTable_professor_id_fkey" FOREIGN KEY (professor_id) REFERENCES public."Professor"(id) ON DELETE CASCADE;
 S   ALTER TABLE ONLY public."TimeTable" DROP CONSTRAINT "TimeTable_professor_id_fkey";
       public               postgres    false    224    4787    226            �           2606    24762 2   class_cancelled class_cancelled_time_table_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.class_cancelled
    ADD CONSTRAINT class_cancelled_time_table_id_fkey FOREIGN KEY (time_table_id) REFERENCES public."TimeTable"(id) ON DELETE CASCADE;
 \   ALTER TABLE ONLY public.class_cancelled DROP CONSTRAINT class_cancelled_time_table_id_fkey;
       public               postgres    false    4791    237    226            �           2606    24688 $   announcements fk_announcements_class    FK CONSTRAINT     �   ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT fk_announcements_class FOREIGN KEY (id) REFERENCES public."Class"(id) ON DELETE CASCADE;
 N   ALTER TABLE ONLY public.announcements DROP CONSTRAINT fk_announcements_class;
       public               postgres    false    4775    222    218            �           2606    24693 (   announcements fk_announcements_professor    FK CONSTRAINT     �   ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT fk_announcements_professor FOREIGN KEY (professor_id) REFERENCES public."Professor"(id) ON DELETE SET NULL;
 R   ALTER TABLE ONLY public.announcements DROP CONSTRAINT fk_announcements_professor;
       public               postgres    false    222    224    4787            �           2606    24676 -   professor_class professor_class_class_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.professor_class
    ADD CONSTRAINT professor_class_class_id_fkey FOREIGN KEY (class_id) REFERENCES public."Class"(id) ON DELETE CASCADE;
 W   ALTER TABLE ONLY public.professor_class DROP CONSTRAINT professor_class_class_id_fkey;
       public               postgres    false    231    4775    218            �           2606    24671 1   professor_class professor_class_professor_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.professor_class
    ADD CONSTRAINT professor_class_professor_id_fkey FOREIGN KEY (professor_id) REFERENCES public."Professor"(id) ON DELETE CASCADE;
 [   ALTER TABLE ONLY public.professor_class DROP CONSTRAINT professor_class_professor_id_fkey;
       public               postgres    false    231    4787    224            �           2606    24743    results results_student_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.results
    ADD CONSTRAINT results_student_id_fkey FOREIGN KEY (student_id) REFERENCES public."Student"(id) ON DELETE CASCADE;
 I   ALTER TABLE ONLY public.results DROP CONSTRAINT results_student_id_fkey;
       public               postgres    false    220    4779    235            �      x������ � �      s   �   x�%̻
�0��Yz�<Aiz����B�kcD,��`9�߾
�����������0���:�`/k-O�`�27<� iY+��㙲'���*��
c�#k�^l��k!���%K�̻�Ee	�=L�|���"� ��-�      }   k   x�3��M,�(V��,Q0�t��-�I-IUp�H-J�,NU0�3T(�R��FF��&����9�!:g����rf��[������%��rp��qqq ��      y   �   x�=�O�0���|;x���柼^��y�l��K*z�D��ܾ��6/���X4�\%��Q��E~���(��L���S5ൺ4ɱ �T,l���t�u��e���(ĆgE����������j[7���Qy�KNO�σ�=z�P�V�Q�}N������g�����8���}:      u   �  x�m�K��0���W�p��@xEf�����5Z2Vo��ж��	j+UcU7�ܜ��0I�*X��	P�mJ�D]�4��	����7Ě~��, ��:�������8F�c�����Ag�h���B�m���u�a*#gR�S*���HB����xgQ������m�Q�AK�n��������<'Eq`|#E�/�ʈ,�yl����-"�+S��=�LZ�[A�s$$�'���VӪn������F�M���������оst�����o��a�7�����_�J��\93���J��)��<+>�6,�y�K�8�۴,(WS��<�r�'�(��f��]��ӿ�����x�1�%�V	ݾ�ۦ��l]�IE>��9�͏���E��-�D��t��\G�tp������?XP[>�ҳrӼ����x�)ky�;sND$�t�۵{@�g���� ���QF$�@X�]�_t�E��6�E���            x������ � �      {   6   x�3�4B�Ē���Ē��bN��ĒҢ��JNK+ �44�0�b���� �      w   Z   x�3��W.M��,.���S0�sJ��@nIfn�BqIiJj^I1�!g�r����Z*[�Z�뙙�k�Zp��qqq ��e      �      x������ � �      �      x�3�4����� ]      �      x������ � �     