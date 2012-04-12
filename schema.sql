--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: item; Type: TABLE; Schema: public; Owner: sugyan; Tablespace: 
--

CREATE TABLE item (
    id integer NOT NULL,
    url character varying(255) NOT NULL,
    count integer NOT NULL,
    title character varying(255) NOT NULL,
    datetime timestamp without time zone NOT NULL
);


ALTER TABLE public.item OWNER TO "sugyan";

--
-- Name: item_id_seq; Type: SEQUENCE; Schema: public; Owner: sugyan
--

CREATE SEQUENCE item_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.item_id_seq OWNER TO "sugyan";

--
-- Name: item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sugyan
--

ALTER SEQUENCE item_id_seq OWNED BY item.id;


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: sugyan
--

ALTER TABLE ONLY item ALTER COLUMN id SET DEFAULT nextval('item_id_seq'::regclass);


--
-- Name: item_pkey; Type: CONSTRAINT; Schema: public; Owner: sugyan; Tablespace: 
--

ALTER TABLE ONLY item
    ADD CONSTRAINT item_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

