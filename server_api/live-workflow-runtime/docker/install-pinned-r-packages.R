options(repos = c(CRAN = "https://cloud.r-project.org"))

required_env <- function(name) {
  value <- Sys.getenv(name, unset = NA_character_)
  if (is.na(value) || !nzchar(value)) {
    stop(name, " must be set", call. = FALSE)
  }
  value
}

cran_source_urls <- function(package, version) {
  c(
    sprintf("https://cran.r-project.org/src/contrib/%s_%s.tar.gz", package, version),
    sprintf("https://cran.r-project.org/src/contrib/Archive/%s/%s_%s.tar.gz", package, package, version)
  )
}

installed_version_matches <- function(package, version) {
  requireNamespace(package, quietly = TRUE) &&
    identical(as.character(utils::packageVersion(package)), version)
}

install_pinned_cran_source <- function(package, version) {
  if (installed_version_matches(package, version)) {
    return(invisible(TRUE))
  }

  errors <- character()
  for (url in cran_source_urls(package, version)) {
    message("Installing ", package, " ", version, " from ", url)
    tryCatch(
      {
        utils::install.packages(url, repos = NULL, type = "source")
        if (installed_version_matches(package, version)) {
          return(invisible(TRUE))
        }

        installed <- if (requireNamespace(package, quietly = TRUE)) {
          as.character(utils::packageVersion(package))
        } else {
          "not installed"
        }
        errors <- c(errors, sprintf("%s left %s at %s", url, package, installed))
      },
      error = function(error) {
        errors <<- c(errors, sprintf("%s failed: %s", url, conditionMessage(error)))
      }
    )
  }

  stop(
    sprintf(
      "Failed to install %s %s. Attempts: %s",
      package,
      version,
      paste(errors, collapse = "; ")
    ),
    call. = FALSE
  )
}

install_pinned_cran_source("pak", required_env("PAK_VERSION"))
install_pinned_cran_source("renv", required_env("RENV_VERSION"))
install_pinned_cran_source("BiocManager", required_env("BIOCMANAGER_VERSION"))
