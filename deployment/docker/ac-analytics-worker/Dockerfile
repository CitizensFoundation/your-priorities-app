FROM python:3.7

RUN git clone https://github.com/CitizensFoundation/ac-analytics-api.git

WORKDIR "ac-analytics-api"

RUN pip install -r requirements.txt 

RUN  python3 -m spacy download en_core_web_sm
RUN  python3 -m spacy download zh_core_web_sm
RUN  python3 -m spacy download de_core_news_sm
RUN  python3 -m spacy download da_core_news_sm
RUN  python3 -m spacy download ja_core_news_sm
RUN  python3 -m spacy download lt_core_news_sm
RUN  python3 -m spacy download nb_core_news_sm
RUN  python3 -m spacy download pl_core_news_sm
RUN  python3 -m spacy download es_core_news_sm
RUN  python3 -m spacy download pt_core_news_sm
RUN  python3 -m spacy download it_core_news_sm
RUN  python3 -m spacy download nl_core_news_sm
RUN  python3 -m spacy download el_core_news_sm
RUN  python3 -m spacy download ro_core_news_sm
RUN  python3 -m spacy download xx_ent_wiki_sm
RUN  python3 -m spacy download fr_core_news_sm
