**Deployment guide:**

https://docs.google.com/document/d/1t9oZRIIOqmxtAszeWLGRb0_ixsmSLdXvwGeej2EA5R8/edit#heading=h.lxo9mbyc2gfz

**Key components of the server platform:**

-   PostgresSQL (the high-performance open-source database)
-   ElasticSearch (database server used for the data analytics part of the platform)
-   Redis (in-memory database used for user sessions and API caching)
-   Your Priorities backend server cluster

    -   Nginx front-end SSL manager and load balancer for the main API and file/media downloads
    -   Your Priorities Server API (talks to the web apps and the rest of the backend platform)
    -   Your Priorities background workers (manage notifications, email, report creation, etc)
    -   Your Priorities Media Encoder (encodes incoming video and audio files into a unified format to then display on in the web app - optional Amazon S3/ElasticEncoder can also be used)
    
    -   Analytics API (front-end to the Python-based Analytics API)
    -   Analytics Worker (does background AI calculations for recommendations and similarities analysis)
    -   Minio (optional - you can also use Amazon S3 for all media uploads and downloads)
    -   CertBot (optional - used to automatically create and renew LetsEncrypt SSL certificates)

-   Your Priorities web apps (the website/user interface)
    
    -   Main client web app (provides the user interface and talks to the backend cluster)
    -   Analytics app (basic analytics and similarities analysis)
    -   Admin app (currently only has features to edit/override Google Translate translations, but will later this year have all of the Your Priorities admin interface as it is moving from the main client web app in the next version)
    -   Your Priorities SDK (coming later this year - Your Priorities web apps are built with the Web Components HTML standard and this SDK will make it easy to create custom web apps for special projects, if needed)

-   Optional external APIs

    -   Google Analytics
    -   Google Maps
    -   Google Translate
    -   Google PerspectiveAPI (free for automatic toxicity analysis)
    -   Google SpeechToText (to create automatic text transcripts of incoming audio/video files)
    -   Outgoing email
    
    -   SMTP to a local email server, or
    -   SendGrid (or comparable services)

-   Airbrake (for error monitoring)
-   NewRelic (for detailed cluster monitoring)

**The absolute minimum requirements to run everything (on a single server):**

Server 1

CPU: 4 x dedicated fast modern server CPUs

RAM: 8GB

**What we'd recommend for to start with (should easily support 100,000+ monthly visits):**
*Server 1 - runs everything*

CPU: 8 x dedicated fast modern server CPUs

RAM: 16GB

*Server 2  - continuous backups from PostresSQL and Minio (if not using S3)*

CPU: 2-4 x dedicated fast modern server CPUs

RAM: 8GB