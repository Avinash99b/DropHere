CREATE TYPE public.transfer_type AS ENUM
    ('text', 'file');

CREATE TABLE IF NOT EXISTS public.transfers
(
    code integer NOT NULL,
    type transfer_type NOT NULL DEFAULT 'text'::transfer_type,
    created_at timestamp(0) with time zone NOT NULL DEFAULT now(),
    CONSTRAINT text_transfer_codes_pkey PRIMARY KEY (code)
)


CREATE TABLE IF NOT EXISTS public.texts
(
    code integer NOT NULL,
    text text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT text_pkey PRIMARY KEY (code),
    CONSTRAINT text_code_fkey FOREIGN KEY (code)
        REFERENCES public.transfers (code) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

CREATE TABLE IF NOT EXISTS public.files
(
    code integer NOT NULL,
    sender_peer_id text COLLATE pg_catalog."default" NOT NULL DEFAULT ''::text,
    CONSTRAINT files_pkey PRIMARY KEY (code),
    CONSTRAINT files_code_fkey FOREIGN KEY (code)
        REFERENCES public.transfers (code) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID
)
