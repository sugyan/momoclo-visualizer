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
    url character varying(255) NOT NULL,
    count integer NOT NULL,
    title character varying(255) NOT NULL,
    member_id integer,
    datetime timestamp with time zone NOT NULL
);


ALTER TABLE public.item OWNER TO sugyan;

--
-- Name: item_pkey; Type: CONSTRAINT; Schema: public; Owner: sugyan; Tablespace: 
--

ALTER TABLE ONLY item
    ADD CONSTRAINT item_pkey PRIMARY KEY (url);


--
-- Name: member_datetime; Type: INDEX; Schema: public; Owner: sugyan; Tablespace: 
--

CREATE INDEX member_datetime ON item USING btree (member_id, datetime);


--
-- PostgreSQL database dump complete
--

