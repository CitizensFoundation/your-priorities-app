import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

test("Codex app-server Dockerfile installs dataset download tools", async () => {
  const dockerfilePath = path.resolve(process.cwd(), "../../infra/docker/codex-app-server/Dockerfile");
  const dockerfile = await fs.readFile(dockerfilePath, "utf8");

  for (const packageName of ["aria2", "curl", "wget", "rsync", "zstd", "pigz"]) {
    assert.match(dockerfile, new RegExp(`\\b${packageName}\\b`, "u"));
  }
});

test("Codex app-server Dockerfile builds pinned CUDA Python R Rust and science runtimes", async () => {
  const rootPath = path.resolve(process.cwd(), "../..");
  const dockerfile = await fs.readFile(path.join(rootPath, "infra/docker/codex-app-server/Dockerfile"), "utf8");
  const buildScript = await fs.readFile(path.join(rootPath, "scripts/build-codex-image.mjs"), "utf8");
  const workerDockerfile = await fs.readFile(path.join(rootPath, "infra/docker/production/Dockerfile.worker"), "utf8");
  const dockerignore = await fs.readFile(path.join(rootPath, "infra/docker/codex-app-server/.dockerignore"), "utf8");
  const pinnedRPackageInstaller = await fs.readFile(
    path.join(rootPath, "infra/docker/codex-app-server/install-pinned-r-packages.R"),
    "utf8"
  );
  const versions = await readJson(path.join(rootPath, "infra/docker/codex-app-server/versions.json"));

  assert.match(dockerfile, new RegExp(`^ARG CUDA_BASE_IMAGE=${escapeRegExp(requiredString(versions.cudaBaseImage))}$`, "mu"));
  assert.match(requiredString(versions.cudaBaseImage), /cudnn-devel/u);
  assert.doesNotMatch(requiredString(versions.cudaBaseImage), /cudnn-runtime/u);
  assert.match(dockerfile, /^FROM \$\{CUDA_BASE_IMAGE\}$/mu);
  assert.match(dockerignore, /!versions\.json/u);
  assert.match(dockerfile, new RegExp(`^ARG NODE_MAJOR=${escapeRegExp(requiredString(versions.nodeMajor))}$`, "mu"));
  assert.match(dockerfile, /https:\/\/deb\.nodesource\.com\/node_\$\{NODE_MAJOR\}\.x/u);
  assert.equal(requiredString(versions.nodeMajor), "24");
  assert.match(dockerfile, new RegExp(`^ARG PYTHON_VERSION=${escapeRegExp(requiredString(versions.pythonVersion))}$`, "mu"));
  assert.match(dockerfile, new RegExp(`^ARG R_VERSION=${escapeRegExp(requiredString(versions.rVersion))}$`, "mu"));
  assert.match(dockerfile, new RegExp(`^ARG UV_VERSION=${escapeRegExp(requiredString(versions.uvVersion))}$`, "mu"));
  assert.match(dockerfile, new RegExp(`^ARG PIPX_VERSION=${escapeRegExp(requiredString(versions.pipxVersion))}$`, "mu"));
  assert.match(dockerfile, new RegExp(`^ARG DOCLING_VERSION=${escapeRegExp(requiredString(versions.doclingVersion))}$`, "mu"));
  assert.match(dockerfile, new RegExp(`^ARG DOCLING_MODELS_PATH=${escapeRegExp(requiredString(versions.doclingModelsPath))}$`, "mu"));
  assert.equal(requiredString(versions.chromeForTestingVersion), "150.0.7871.124");
  assert.equal(requiredString(versions.chromeForTestingRevision), "1639810");
  assert.match(
    requiredString(versions.chromeForTestingChromeLinux64Url),
    new RegExp(`${escapeRegExp(requiredString(versions.chromeForTestingVersion))}/linux64/chrome-linux64\\.zip$`, "u")
  );
  assert.match(
    requiredString(versions.chromeForTestingChromeDriverLinux64Url),
    new RegExp(`${escapeRegExp(requiredString(versions.chromeForTestingVersion))}/linux64/chromedriver-linux64\\.zip$`, "u")
  );
  assert.match(dockerfile, new RegExp(`^ARG CHROME_FOR_TESTING_VERSION=${escapeRegExp(requiredString(versions.chromeForTestingVersion))}$`, "mu"));
  assert.match(dockerfile, new RegExp(`^ARG CHROME_FOR_TESTING_REVISION=${escapeRegExp(requiredString(versions.chromeForTestingRevision))}$`, "mu"));
  assert.match(dockerfile, new RegExp(`^ARG CHROME_FOR_TESTING_CHROME_LINUX64_URL=${escapeRegExp(requiredString(versions.chromeForTestingChromeLinux64Url))}$`, "mu"));
  assert.match(dockerfile, new RegExp(`^ARG CHROME_FOR_TESTING_CHROMEDRIVER_LINUX64_URL=${escapeRegExp(requiredString(versions.chromeForTestingChromeDriverLinux64Url))}$`, "mu"));
  assert.match(dockerfile, new RegExp(`^ARG PYTHON_PLAYWRIGHT_VERSION=${escapeRegExp(requiredString(versions.pythonPlaywrightVersion))}$`, "mu"));
  assert.match(dockerfile, new RegExp(`^ARG SELENIUM_VERSION=${escapeRegExp(requiredString(versions.seleniumVersion))}$`, "mu"));
  assert.match(dockerfile, new RegExp(`^ARG PUPPETEER_CORE_VERSION=${escapeRegExp(requiredString(versions.puppeteerCoreVersion))}$`, "mu"));
  assert.match(dockerfile, new RegExp(`^ARG PLAYWRIGHT_CORE_VERSION=${escapeRegExp(requiredString(versions.playwrightCoreVersion))}$`, "mu"));
  assert.equal(requiredString(versions.onnxruntimeGpuVersion), "1.24.4");
  assert.match(dockerfile, new RegExp(`^ARG ONNXRUNTIME_GPU_VERSION=${escapeRegExp(requiredString(versions.onnxruntimeGpuVersion))}$`, "mu"));
  assert.match(dockerfile, new RegExp(`^ARG TORCH_VERSION=${escapeRegExp(requiredString(versions.torchVersion))}$`, "mu"));
  assert.match(dockerfile, new RegExp(`^ARG TORCHVISION_VERSION=${escapeRegExp(requiredString(versions.torchvisionVersion))}$`, "mu"));
  assert.match(dockerfile, new RegExp(`^ARG JAX_VERSION=${escapeRegExp(requiredString(versions.jaxVersion))}$`, "mu"));
  assert.match(dockerfile, new RegExp(`^ARG PAK_VERSION=${escapeRegExp(requiredString(versions.pakVersion))}$`, "mu"));
  assert.match(dockerfile, new RegExp(`^ARG RENV_VERSION=${escapeRegExp(requiredString(versions.renvVersion))}$`, "mu"));
  assert.match(dockerfile, new RegExp(`^ARG BIOCMANAGER_VERSION=${escapeRegExp(requiredString(versions.biocManagerVersion))}$`, "mu"));
  assert.match(
    dockerfile,
    new RegExp(`^ARG BIOCONDUCTOR_MIRROR=${escapeRegExp(requiredString(versions.bioconductorMirror))}$`, "mu")
  );
  assert.match(dockerfile, new RegExp(`^ARG RUST_VERSION=${escapeRegExp(requiredString(versions.rustVersion))}$`, "mu"));
  assert.match(dockerfile, new RegExp(`^ARG RUSTUP_VERSION=${escapeRegExp(requiredString(versions.rustupVersion))}$`, "mu"));
  assert.match(dockerfile, new RegExp(`^ARG RUSTUP_INIT_SHA256=${escapeRegExp(requiredString(versions.rustupInitSha256))}$`, "mu"));
  assert.match(dockerfile, new RegExp(`^ARG CARGO_NEXTEST_VERSION=${escapeRegExp(requiredString(versions.cargoNextestVersion))}$`, "mu"));
  assert.match(dockerfile, new RegExp(`^ARG CARGO_EDIT_VERSION=${escapeRegExp(requiredString(versions.cargoEditVersion))}$`, "mu"));
  assert.match(dockerfile, new RegExp(`^ARG CARGO_AUDIT_VERSION=${escapeRegExp(requiredString(versions.cargoAuditVersion))}$`, "mu"));
  assert.match(dockerfile, new RegExp(`^ARG CARGO_DENY_VERSION=${escapeRegExp(requiredString(versions.cargoDenyVersion))}$`, "mu"));
  assert.match(dockerfile, new RegExp(`^ARG CARGO_LLVM_COV_VERSION=${escapeRegExp(requiredString(versions.cargoLlvmCovVersion))}$`, "mu"));
  assert.match(dockerfile, new RegExp(`^ARG CARGO_EXPAND_VERSION=${escapeRegExp(requiredString(versions.cargoExpandVersion))}$`, "mu"));
  assert.match(dockerfile, new RegExp(`^ARG CARGO_OUTDATED_VERSION=${escapeRegExp(requiredString(versions.cargoOutdatedVersion))}$`, "mu"));
  assert.match(dockerfile, new RegExp(`^ARG CARGO_WATCH_VERSION=${escapeRegExp(requiredString(versions.cargoWatchVersion))}$`, "mu"));
  assert.match(dockerfile, new RegExp(`^ARG CARGO_BLOAT_VERSION=${escapeRegExp(requiredString(versions.cargoBloatVersion))}$`, "mu"));
  assert.match(dockerfile, new RegExp(`^ARG WASM_PACK_VERSION=${escapeRegExp(requiredString(versions.wasmPackVersion))}$`, "mu"));
  assert.match(dockerfile, new RegExp(`^ARG CBINDGEN_VERSION=${escapeRegExp(requiredString(versions.cbindgenVersion))}$`, "mu"));
  assert.match(dockerfile, new RegExp(`^ARG BINDGEN_CLI_VERSION=${escapeRegExp(requiredString(versions.bindgenCliVersion))}$`, "mu"));
  assert.match(dockerfile, new RegExp(`^ARG CARGO_SEMVER_CHECKS_VERSION=${escapeRegExp(requiredString(versions.cargoSemverChecksVersion))}$`, "mu"));
  assert.match(dockerfile, new RegExp(`^ARG JUST_VERSION=${escapeRegExp(requiredString(versions.justVersion))}$`, "mu"));
  assert.match(dockerfile, new RegExp(`^ARG SCCACHE_VERSION=${escapeRegExp(requiredString(versions.sccacheVersion))}$`, "mu"));
  assert.match(dockerfile, new RegExp(`^ARG MATURIN_VERSION=${escapeRegExp(requiredString(versions.maturinVersion))}$`, "mu"));
  assert.match(dockerfile, new RegExp(`^ARG QUARTO_VERSION=${escapeRegExp(requiredString(versions.quartoVersion))}$`, "mu"));
  assert.match(dockerfile, new RegExp(`^ARG QUARTO_LINUX_AMD64_URL=${escapeRegExp(requiredString(versions.quartoLinuxAmd64Url))}$`, "mu"));
  assert.match(dockerfile, new RegExp(`^ARG QUARTO_LINUX_AMD64_SHA256=${escapeRegExp(requiredString(versions.quartoLinuxAmd64Sha256))}$`, "mu"));

  for (const packageName of [
    "gfortran",
    "cmake",
    "ninja-build",
    "libopenblas-dev",
    "libhdf5-dev",
    "default-jdk-headless",
    "libfftw3-dev",
    "libmagick++-dev",
    "libopencv-dev",
    "libopenslide-dev",
    "libwebp-dev",
    "pandoc",
    "nodejs",
    "poppler-utils",
    "qpdf",
    "ghostscript",
    "tesseract-ocr",
    "tesseract-ocr-eng",
    "libreoffice",
    "mafft",
    "clustalo",
    "muscle",
    "kalign",
    "hmmer",
    "fonts-liberation",
    "libasound2t64",
    "libatk-bridge2.0-0",
    "libatk1.0-0",
    "libcups2",
    "libdbus-1-3",
    "libdrm2",
    "libgbm1",
    "libgtk-3-0",
    "libnspr4",
    "libnss3",
    "libxcomposite1",
    "libxdamage1",
    "libxfixes3",
    "libxkbcommon0",
    "libxrandr2",
    "xdg-utils",
  ]) {
    assert.match(dockerfile, new RegExp(`\\b${escapeRegExp(packageName)}\\b`, "u"));
  }
  for (const rustPackageName of ["clang", "lld", "llvm", "libclang-dev", "musl-tools"]) {
    assert.match(dockerfile, new RegExp(`\\b${escapeRegExp(rustPackageName)}\\b`, "u"));
  }
  assert.match(dockerfile, /make -j"\$\(nproc\)"/u);
  assert.match(dockerfile, /uv==\$\{UV_VERSION\}/u);
  assert.match(dockerfile, /pipx==\$\{PIPX_VERSION\}/u);
  for (const documentPythonPackage of [
    "python-calamine",
    "fastexcel",
    "openpyxl",
    "xlsxwriter",
    "xlrd",
    "pyxlsb",
    "odfpy",
    "defusedxml",
    "pdfplumber",
    "pikepdf",
    "camelot-py",
    "reportlab",
    "pymupdf",
    "pymupdf4llm",
    "ocrmypdf",
    "python-docx",
    "python-pptx",
    "beautifulsoup4",
    "lxml",
    "html5lib",
    "markdownify",
  ]) {
    assert.match(dockerfile, new RegExp(`\\b${escapeRegExp(documentPythonPackage)}\\b`, "u"));
  }
  assert.match(dockerfile, /"pypdf\[crypto\]"/u);
  for (const bioinformaticsPythonPackage of ["biopython", "pyfamsa", "pyhmmer", "pytrimal", "scikit-bio"]) {
    assert.match(dockerfile, new RegExp(`\\b${escapeRegExp(bioinformaticsPythonPackage)}\\b`, "u"));
  }
  assert.match(dockerfile, /docling==\$\{DOCLING_VERSION\}/u);
  assert.match(
    dockerfile,
    /"\/opt\/python\/\$\{PYTHON_VERSION\}\/bin\/docling-tools" models download layout tableformer rapidocr --output-dir "\$\{DOCLING_MODELS_PATH\}"/u
  );
  assert.match(dockerfile, /"\/opt\/python\/\$\{PYTHON_VERSION\}\/bin\/docling" --version/u);
  assert.match(dockerfile, /mkdir -p \/opt\/yp-live-workflow-browser/u);
  assert.match(dockerfile, /curl -fsSL "\$\{CHROME_FOR_TESTING_CHROME_LINUX64_URL\}" -o \/tmp\/chrome-linux64\.zip/u);
  assert.match(dockerfile, /curl -fsSL "\$\{CHROME_FOR_TESTING_CHROMEDRIVER_LINUX64_URL\}" -o \/tmp\/chromedriver-linux64\.zip/u);
  assert.match(dockerfile, /unzip -q \/tmp\/chrome-linux64\.zip -d \/opt\/yp-live-workflow-browser/u);
  assert.match(dockerfile, /unzip -q \/tmp\/chromedriver-linux64\.zip -d \/opt\/yp-live-workflow-browser/u);
  assert.match(dockerfile, /\/opt\/yp-live-workflow-browser\/chrome-linux64\/chrome --version \| grep -F "\$\{CHROME_FOR_TESTING_VERSION\}"/u);
  assert.match(dockerfile, /\/opt\/yp-live-workflow-browser\/chromedriver-linux64\/chromedriver --version \| grep -F "\$\{CHROME_FOR_TESTING_VERSION\}"/u);
  assert.match(dockerfile, /chrome-for-testing-version\.txt/u);
  assert.match(dockerfile, /PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1/u);
  assert.match(dockerfile, /playwright==\$\{PYTHON_PLAYWRIGHT_VERSION\}/u);
  assert.match(dockerfile, /selenium==\$\{SELENIUM_VERSION\}/u);
  for (const pythonDevelopmentPackage of [
    "pytest",
    "pytest-cov",
    "pytest-xdist",
    "hypothesis",
    "ruff",
    "mypy",
    "nox",
    "pre-commit",
    "snakemake",
    "jupyterlab",
    "papermill",
    "mlflow",
    "optuna",
    "pandera",
    "great-expectations",
    "pymc",
    "arviz",
  ]) {
    assert.match(dockerfile, new RegExp(`\\b${escapeRegExp(pythonDevelopmentPackage)}\\b`, "u"));
  }
  assert.match(dockerfile, /npm install --prefix \/opt\/yp-live-workflow-node-tools/u);
  assert.match(dockerfile, /puppeteer-core@\$\{PUPPETEER_CORE_VERSION\}/u);
  assert.match(dockerfile, /playwright-core@\$\{PLAYWRIGHT_CORE_VERSION\}/u);
  assert.match(dockerfile, /"onnxruntime-gpu==\$\{ONNXRUNTIME_GPU_VERSION\}"/u);
  assert.match(dockerfile, /"onnxruntime==\$\{ONNXRUNTIME_GPU_VERSION\}"/u);
  assert.match(dockerfile, /--force-reinstall --no-deps "onnxruntime-gpu==\$\{ONNXRUNTIME_GPU_VERSION\}"/u);
  assert.match(dockerfile, /onnxruntime\.__version__ == '\$\{ONNXRUNTIME_GPU_VERSION\}'/u);
  assert.match(workerDockerfile, new RegExp(`^ARG DOCLING_VERSION=${escapeRegExp(requiredString(versions.doclingVersion))}$`, "mu"));
  assert.match(dockerfile, /torch==\$\{TORCH_VERSION\}/u);
  assert.match(dockerfile, /torchvision==\$\{TORCHVISION_VERSION\}/u);
  for (const pythonVisionPackage of [
    "transformers",
    "accelerate",
    "huggingface-hub",
    "tokenizers",
    "safetensors",
    "sentencepiece",
    "timm",
    "open-clip-torch",
    "diffusers",
    "peft",
    "einops",
    "torchmetrics",
    "lightning",
    "opencv-python-headless",
    "scikit-image",
    "albumentations",
    "kornia",
    "pycocotools",
    "imageio",
    "imagecodecs",
    "tifffile",
    "monai",
    "SimpleITK",
    "pydicom",
    "nibabel",
    "openslide-python",
    "ome-zarr",
    "cellpose",
    "onnx",
    "onnxruntime-gpu",
    "faiss-cpu",
    "hnswlib",
  ]) {
    assert.match(dockerfile, new RegExp(`\\b${escapeRegExp(pythonVisionPackage)}\\b`, "u"));
  }
  assert.match(dockerfile, /"datasets\[vision\]"/u);
  assert.match(dockerfile, /jax==\$\{JAX_VERSION\}/u);
  for (const tabularPythonPackage of ["pandas", "polars", "pyarrow", "duckdb", "narwhals", "tabulate"]) {
    assert.match(dockerfile, new RegExp(`\\b${escapeRegExp(tabularPythonPackage)}\\b`, "u"));
  }
  assert.match(dockerfile, /scanpy/u);
  assert.match(dockerfile, /Seurat/u);
  assert.match(dockerfile, /SingleCellExperiment/u);
  for (const msaRPackage of ["ape", "phangorn", "seqinr", "DECIPHER", "msa", "ggtree", "ggmsa"]) {
    assert.match(dockerfile, new RegExp(`'${escapeRegExp(msaRPackage)}'`, "u"));
  }
  for (const rVisionPackage of [
    "safetensors",
    "magick",
    "imager",
    "opencv",
    "OpenImageR",
    "jpeg",
    "png",
    "tiff",
    "webp",
    "ijtiff",
    "EBImage",
    "RBioFormats",
    "cytomapper",
    "imcRtools",
    "simpleSeg",
  ]) {
    assert.match(dockerfile, new RegExp(`'${escapeRegExp(rVisionPackage)}'`, "u"));
  }
  for (const rDevelopmentPackage of [
    "testthat",
    "covr",
    "lintr",
    "styler",
    "languageserver",
    "roxygen2",
    "pkgload",
    "remotes",
    "knitr",
    "rmarkdown",
    "targets",
    "crew",
    "future",
    "furrr",
    "tidymodels",
    "mlr3",
  ]) {
    assert.match(dockerfile, new RegExp(`'${escapeRegExp(rDevelopmentPackage)}'`, "u"));
  }
  for (const optionalRPackage of [
    "torch",
    "torchvision",
    "luz",
    "torchdatasets",
    "mlr3torch",
    "torchopt",
    "tidyverse",
    "arrow",
    "duckdb",
    "org.Hs.eg.db",
    "zellkonverter",
    "sf",
    "terra",
    "stars",
    "raster",
    "exactextractr",
    "lidR",
    "SpatialFeatureExperiment",
    "Voyager",
  ]) {
    assert.doesNotMatch(dockerfile, new RegExp(`'${escapeRegExp(optionalRPackage)}'`, "u"));
  }
  assert.doesNotMatch(dockerfile, /torch::install_torch/u);
  assert.match(dockerfile, /COPY install-pinned-r-packages\.R \/tmp\/install-pinned-r-packages\.R/u);
  assert.match(dockerignore, /^!install-pinned-r-packages\.R$/mu);
  assert.match(dockerignore, /^!patches\/$/mu);
  assert.match(dockerignore, /^!patches\/background-terminal-progressive-poll\.patch$/mu);
  assert.match(dockerfile, /PAK_VERSION="\$\{PAK_VERSION\}"/u);
  assert.match(dockerfile, /RENV_VERSION="\$\{RENV_VERSION\}"/u);
  assert.match(dockerfile, /BIOCMANAGER_VERSION="\$\{BIOCMANAGER_VERSION\}"/u);
  assert.match(dockerfile, /bioc_index_url="\$\{BIOCONDUCTOR_MIRROR%\/\}\/packages\/\$\{bioc_version\}\/bioc\/src\/contrib\/PACKAGES"/u);
  assert.match(dockerfile, /curl -fsSL --retry 4 --retry-all-errors/u);
  assert.match(dockerfile, /BioC_mirror='\$\{BIOCONDUCTOR_MIRROR\}'/u);
  assert.match(dockerfile, /for \(attempt in seq_len\(3L\)\)/u);
  assert.match(buildScript, /\["BIOCONDUCTOR_MIRROR", versions\.bioconductorMirror\]/u);
  assert.match(pinnedRPackageInstaller, /src\/contrib\/%s_%s\.tar\.gz/u);
  assert.match(pinnedRPackageInstaller, /src\/contrib\/Archive\/%s\/%s_%s\.tar\.gz/u);
  assert.match(pinnedRPackageInstaller, /install_pinned_cran_source\("pak", required_env\("PAK_VERSION"\)\)/u);
  assert.match(pinnedRPackageInstaller, /install_pinned_cran_source\("renv", required_env\("RENV_VERSION"\)\)/u);
  assert.match(pinnedRPackageInstaller, /install_pinned_cran_source\("BiocManager", required_env\("BIOCMANAGER_VERSION"\)\)/u);
  assert.match(dockerfile, /RUSTUP_HOME=\/opt\/rustup CARGO_HOME=\/usr\/local\/cargo \/tmp\/rustup-init/u);
  assert.match(dockerfile, /rustup component add rust-src rust-analyzer llvm-tools-preview/u);
  assert.match(
    dockerfile,
    /rustup target add --toolchain "\$\{RUST_VERSION\}" wasm32-unknown-unknown wasm32-wasip1 x86_64-unknown-linux-musl/u
  );
  assert.match(dockerfile, /cargo install --locked --root \/usr\/local cargo-nextest --version "\$\{CARGO_NEXTEST_VERSION\}"/u);
  assert.match(dockerfile, /cargo install --locked --root \/usr\/local cargo-edit --version "\$\{CARGO_EDIT_VERSION\}"/u);
  assert.match(dockerfile, /cargo install --locked --root \/usr\/local cargo-audit --version "\$\{CARGO_AUDIT_VERSION\}"/u);
  assert.match(dockerfile, /cargo install --locked --root \/usr\/local cargo-deny --version "\$\{CARGO_DENY_VERSION\}"/u);
  for (const [crateName, versionArg] of [
    ["cargo-llvm-cov", "CARGO_LLVM_COV_VERSION"],
    ["cargo-expand", "CARGO_EXPAND_VERSION"],
    ["cargo-outdated", "CARGO_OUTDATED_VERSION"],
    ["cargo-watch", "CARGO_WATCH_VERSION"],
    ["cargo-bloat", "CARGO_BLOAT_VERSION"],
    ["wasm-pack", "WASM_PACK_VERSION"],
    ["cbindgen", "CBINDGEN_VERSION"],
    ["bindgen-cli", "BINDGEN_CLI_VERSION"],
    ["cargo-semver-checks", "CARGO_SEMVER_CHECKS_VERSION"],
    ["just", "JUST_VERSION"],
  ]) {
    assert.match(
      dockerfile,
      new RegExp(`cargo install --locked --root /usr/local ${escapeRegExp(crateName)} --version "\\$\\{${versionArg}\\}"`, "u")
    );
  }
  assert.match(dockerfile, /cargo install --locked --root \/usr\/local sccache --version "\$\{SCCACHE_VERSION\}"/u);
  assert.match(dockerfile, /cargo install --locked --root \/usr\/local maturin --version "\$\{MATURIN_VERSION\}"/u);
  assert.match(dockerfile, /command -v cargo-add cargo-rm cargo-set-version cargo-upgrade/u);
  assert.match(dockerfile, /ENV RUSTUP_HOME=\/opt\/rustup/u);
  assert.match(dockerfile, /^ENV CUDA_HOME=\/usr\/local\/cuda$/mu);
  assert.match(dockerfile, /^ENV CUDA_ROOT=\/usr\/local\/cuda$/mu);
  assert.match(dockerfile, /ENV LD_LIBRARY_PATH="\/usr\/local\/cuda\/lib64:\/usr\/local\/cuda\/targets\/x86_64-linux\/lib:\$\{LD_LIBRARY_PATH\}"/u);
  assert.match(dockerfile, /ENV PATH="[^"]*\/usr\/local\/cuda\/bin/u);
  assert.match(dockerfile, /ENV CARGO_HOME=\/cache\/cargo/u);
  assert.match(dockerfile, /ENV CARGO_TARGET_DIR=\/cache\/cargo-target/u);
  assert.match(dockerfile, /ENV CARGO_TARGET_X86_64_UNKNOWN_LINUX_MUSL_LINKER=musl-gcc/u);
  assert.match(dockerfile, /ENV CC_x86_64_unknown_linux_musl=musl-gcc/u);
  assert.match(dockerfile, /ENV SCCACHE_DIR=\/cache\/sccache/u);
  assert.match(dockerfile, /ENV YP_LIVE_WORKFLOW_DOCLING_BIN=\/opt\/python\/\$\{PYTHON_VERSION\}\/bin\/docling/u);
  assert.match(dockerfile, /ENV YP_LIVE_WORKFLOW_DOCLING_ARTIFACTS_PATH=\$\{DOCLING_MODELS_PATH\}/u);
  assert.match(dockerfile, /ENV DOCLING_ARTIFACTS_PATH=\$\{DOCLING_MODELS_PATH\}/u);
  assert.match(dockerfile, /ENV YP_LIVE_WORKFLOW_DOCLING_DEVICE=auto/u);
  assert.match(dockerfile, /ENV YP_LIVE_WORKFLOW_DOCLING_OCR_MODE=auto/u);
  assert.match(dockerfile, /ENV YP_LIVE_WORKFLOW_CHROME_BIN=\/opt\/yp-live-workflow-browser\/chrome-linux64\/chrome/u);
  assert.match(dockerfile, /ENV PUPPETEER_EXECUTABLE_PATH=\$\{YP_LIVE_WORKFLOW_CHROME_BIN\}/u);
  assert.match(dockerfile, /ENV YP_LIVE_WORKFLOW_CHROMEDRIVER_BIN=\/opt\/yp-live-workflow-browser\/chromedriver-linux64\/chromedriver/u);
  assert.match(dockerfile, /ENV SE_AVOID_STATS=true/u);
  assert.match(dockerfile, /ENV NODE_PATH=\/opt\/yp-live-workflow-node-tools\/node_modules/u);
  assert.match(dockerfile, /echo "\$\{QUARTO_LINUX_AMD64_SHA256\}  \/tmp\/quarto-linux-amd64\.tar\.gz" \| sha256sum -c -/u);
  assert.match(dockerfile, /ln -sf "\/opt\/quarto\/\$\{QUARTO_VERSION\}\/bin\/quarto" \/usr\/local\/bin\/quarto/u);
  assert.match(dockerfile, /rm -f \/tmp\/quarto-linux-amd64\.tar\.gz/u);
});

test("Codex app-server Dockerfile and entrypoint support inner Docker", async () => {
  const rootPath = path.resolve(process.cwd(), "../..");
  const dockerfile = await fs.readFile(path.join(rootPath, "infra/docker/codex-app-server/Dockerfile"), "utf8");
  const entrypoint = await fs.readFile(path.join(rootPath, "infra/docker/codex-app-server/docker-entrypoint.sh"), "utf8");

  assert.match(dockerfile, /\bdocker\.io\b/u);
  assert.match(entrypoint, /YP_LIVE_WORKFLOW_START_INNER_DOCKER/u);
  assert.match(entrypoint, /YP_LIVE_WORKFLOW_START_INNER_DOCKER:-1/u);
  assert.match(entrypoint, /YP_LIVE_WORKFLOW_CAPABILITY_BIN_PATH:-\/cache\/capabilities\/bin/u);
  assert.match(entrypoint, /export PATH="\$\{capability_bin_path\}:\$\{PATH\}"/u);
  assert.match(entrypoint, /\/cache\/cargo/u);
  assert.match(entrypoint, /\/cache\/cargo-target/u);
  assert.match(entrypoint, /\/cache\/sccache/u);
  assert.match(entrypoint, /id -u/u);
  assert.match(entrypoint, /\bdockerd\b/u);
  assert.match(entrypoint, /docker info/u);
  assert.doesNotMatch(entrypoint, /YP_LIVE_WORKFLOW_START_INNER_DOCKER=auto/u);
});

test("Codex Docker smoke validates CUDA devel and direct GPU paths", async () => {
  const rootPath = path.resolve(process.cwd(), "../..");
  const smokeScript = await fs.readFile(path.join(rootPath, "scripts/smoke-codex-docker.mjs"), "utf8");

  assert.match(smokeScript, /Node\.js version/u);
  assert.match(smokeScript, /versions\.nodeMajor/u);
  assert.match(smokeScript, /Python spreadsheet PDF and document stack/u);
  assert.match(smokeScript, /torch, torchvision/u);
  assert.match(smokeScript, /Python vision and multimodal stack/u);
  assert.match(smokeScript, /AutoConfig\.for_model\('bert'\)/u);
  assert.match(smokeScript, /open_clip\.create_model\('ViT-B-32', pretrained=None\)/u);
  assert.match(smokeScript, /Python image processing stack/u);
  assert.match(smokeScript, /coco_mask\.encode/u);
  assert.match(smokeScript, /Python biomedical imaging and vector search stack/u);
  assert.match(smokeScript, /SimpleITK as sitk, cellpose, faiss, hnswlib/u);
  assert.match(smokeScript, /versions\.onnxruntimeGpuVersion/u);
  assert.match(smokeScript, /onnxruntime\.get_available_providers/u);
  assert.match(smokeScript, /R vision and bioimage stack/u);
  assert.match(smokeScript, /library\(safetensors\)/u);
  assert.match(smokeScript, /library\(RBioFormats\)/u);
  assert.match(smokeScript, /pandas\.read_excel\(xlsx, engine='calamine'\)/u);
  assert.match(smokeScript, /pdfplumber\.open/u);
  assert.match(smokeScript, /pymupdf4llm\.to_markdown/u);
  assert.match(smokeScript, /Docling CLI and bundled models/u);
  assert.match(smokeScript, /DOCLING_ARTIFACTS_PATH/u);
  assert.match(smokeScript, /YP_LIVE_WORKFLOW_DOCLING_ARTIFACTS_PATH/u);
  assert.match(smokeScript, /versions\.doclingModelsPath/u);
  assert.match(smokeScript, /OCR and document conversion CLIs/u);
  assert.match(smokeScript, /libreoffice --headless --version/u);
  assert.match(smokeScript, /ocrmypdf --version/u);
  assert.match(smokeScript, /Python HTML parsing stack/u);
  assert.match(smokeScript, /BeautifulSoup/u);
  assert.match(smokeScript, /html5lib, lxml, markdownify/u);
  assert.match(smokeScript, /Browser automation stack/u);
  assert.match(smokeScript, /YP_LIVE_WORKFLOW_CHROME_BIN/u);
  assert.match(smokeScript, /YP_LIVE_WORKFLOW_CHROMEDRIVER_BIN/u);
  assert.match(smokeScript, /PUPPETEER_EXECUTABLE_PATH/u);
  assert.match(smokeScript, /versions\.chromeForTestingVersion/u);
  assert.match(smokeScript, /playwright\.sync_api/u);
  assert.match(smokeScript, /selenium import webdriver/u);
  assert.match(smokeScript, /puppeteer-core/u);
  assert.match(smokeScript, /playwright-core/u);
  assert.match(smokeScript, /Playwright Python OK/u);
  assert.match(smokeScript, /Selenium OK/u);
  assert.match(smokeScript, /Puppeteer OK/u);
  assert.match(smokeScript, /Playwright Core OK/u);
  assert.match(smokeScript, /Python tabular data stack/u);
  assert.match(smokeScript, /duckdb\.sql/u);
  assert.match(smokeScript, /tabulate\.tabulate/u);
  assert.match(smokeScript, /narwhals/u);
  assert.match(smokeScript, /Python MSA stack/u);
  assert.match(smokeScript, /pyfamsa, pyhmmer, pytrimal, skbio/u);
  assert.match(smokeScript, /TabularMSA/u);
  assert.match(smokeScript, /Python development and workflow stack/u);
  assert.match(smokeScript, /python3 -m pytest -n 2 --cov=test_tools/u);
  assert.match(smokeScript, /snakemake --cores 1 result\.txt/u);
  assert.match(smokeScript, /papermill\.execute_notebook/u);
  assert.match(smokeScript, /mlflow\.set_tracking_uri/u);
  assert.match(smokeScript, /optuna\.create_study/u);
  assert.match(smokeScript, /pa\.DataFrameSchema/u);
  assert.match(smokeScript, /pm\.Model/u);
  assert.match(smokeScript, /MSA CLI tools/u);
  assert.match(smokeScript, /mafft --auto/u);
  assert.match(smokeScript, /clustalo -i/u);
  assert.match(smokeScript, /hmmalign -o/u);
  assert.match(smokeScript, /R MSA stack/u);
  assert.match(smokeScript, /DECIPHER::AlignSeqs/u);
  assert.match(smokeScript, /msa::msa/u);
  assert.match(smokeScript, /ggmsa::ggmsa/u);
  assert.match(smokeScript, /R development and workflow stack/u);
  assert.match(smokeScript, /library\(targets\)/u);
  assert.match(smokeScript, /library\(tidymodels\)/u);
  assert.match(smokeScript, /mlr3::lrn/u);
  assert.match(smokeScript, /Quarto Python and R rendering/u);
  assert.match(smokeScript, /quarto render python\.qmd/u);
  assert.match(smokeScript, /quarto render r\.qmd/u);
  assert.match(smokeScript, /cargo-llvm-cov/u);
  assert.match(smokeScript, /cargo-semver-checks/u);
  assert.match(smokeScript, /cargo llvm-cov --no-report/u);
  assert.match(smokeScript, /bindgen smoke\.h --output bindings\.rs/u);
  assert.match(smokeScript, /CUDA devel compiler toolchain/u);
  assert.match(smokeScript, /command -v ptxas nvcc nvlink/u);
  assert.match(smokeScript, /libdevice\/libdevice\.10\.bc/u);
  assert.match(smokeScript, /libnvJitLink\.so\.12/u);
  assert.match(smokeScript, /YP_LIVE_WORKFLOW_DOCKER_GPU_MODE/u);
  assert.match(smokeScript, /YP_LIVE_WORKFLOW_DOCKER_NVIDIA_DIRECT_UTILITY_MOUNTS/u);
  assert.match(smokeScript, /nvidia_direct/u);
  assert.match(smokeScript, /docker_gpus/u);
  assert.match(smokeScript, /dockerGpuMode\(process\.env\.YP_LIVE_WORKFLOW_DOCKER_GPU_MODE, dockerRuntime\)/u);
  assert.match(smokeScript, /Linux Sysbox GPU sessions use direct NVIDIA mounts/u);
  assert.match(smokeScript, /isLinuxSysboxRuntime\(runtime\) \? "nvidia_direct" : "docker_gpus"/u);
  assert.match(smokeScript, /const runtimeArgs = dockerRuntime \? \["--runtime", dockerRuntime\] : \[\]/u);
  assert.match(smokeScript, /return \[\.\.\.runtimeArgs, "--gpus", "all"/u);
  assert.match(smokeScript, /utilityMountArgs/u);
  assert.match(smokeScript, /source=\$\{utilityPath\},target=\$\{utilityPath\},readonly/u);
  assert.match(smokeScript, /runImageCheck\("NVIDIA SMI diagnostic"/u);
  assert.doesNotMatch(smokeScript, /runOptionalImageCheck\("NVIDIA SMI diagnostic"/u);
  assert.match(smokeScript, /torch\.cuda\.synchronize/u);
  assert.match(smokeScript, /jax\.jit/u);
  assert.match(smokeScript, /cudaGetDeviceCount/u);
  assert.match(smokeScript, /nvmlDeviceGetCount_v2/u);
  assert.doesNotMatch(smokeScript, /command -v nvjitlink/u);
});

test("Codex build cache boundary follows heavyweight runtime setup", async () => {
  const dockerfilePath = path.resolve(
    process.cwd(),
    "../../infra/docker/codex-app-server/Dockerfile"
  );
  const dockerfile = await fs.readFile(dockerfilePath, "utf8");
  const position = (marker: string): number => {
    const index = dockerfile.indexOf(marker);
    assert.notEqual(index, -1, `Dockerfile is missing cache-boundary marker: ${marker}`);
    return index;
  };

  const heavyweightRuntimeEnd = position(
    "rm -rf /tmp/rustup-init /tmp/cargo-install-target /usr/local/cargo/registry /usr/local/cargo/git"
  );
  const codexVersionArg = position("ARG CODEX_VERSION=");
  const codexInstall = position('npm install -g "@openai/codex@${CODEX_VERSION}"');
  const patchRevisionArg = position("ARG CODEX_PATCH_REVISION=");
  const patchShaArg = position("ARG CODEX_PATCH_SHA256=");
  const patchCopy = position(
    "COPY patches/background-terminal-progressive-poll.patch"
  );
  const codexBuild = position(
    'cargo "+${CODEX_RUST_VERSION}" build --locked --release'
  );
  const patchLabel = position('LABEL ai.yp-live-workflow.codex.patch-revision=');

  assert.ok(heavyweightRuntimeEnd < codexVersionArg);
  assert.ok(codexVersionArg < codexInstall);
  assert.ok(codexInstall < patchRevisionArg);
  assert.ok(codexInstall < patchShaArg);
  assert.ok(patchRevisionArg < patchCopy);
  assert.ok(patchShaArg < patchCopy);
  assert.ok(patchCopy < codexBuild);
  assert.ok(codexBuild < patchLabel);
});

test("Codex app-server version pins stay aligned with the generated schema", async () => {
  const rootPath = path.resolve(process.cwd(), "../..");
  const vmAgentPackage = await readJson(path.resolve(process.cwd(), "package.json"));
  const rootPackage = await readJson(path.join(rootPath, "package.json"));
  const versions = await readJson(path.join(rootPath, "infra/docker/codex-app-server/versions.json"));
  const codexVersion = stringValue(jsonRecord(vmAgentPackage.dependencies)["@openai/codex"]);
  const imageVersion = requiredString(versions.imageVersion);
  const rootScripts = jsonRecord(rootPackage.scripts);

  assert.ok(codexVersion);
  assert.equal(versions.codexVersion, codexVersion);
  assert.match(imageVersion, /^\d{8}\.[1-9]\d*$/u);

  const dockerfile = await fs.readFile(path.join(rootPath, "infra/docker/codex-app-server/Dockerfile"), "utf8");
  const workflow = await fs.readFile(path.join(rootPath, ".github/workflows/codex-app-server-image.yml"), "utf8");
  const buildScript = await fs.readFile(path.join(rootPath, "scripts/build-codex-image.mjs"), "utf8");
  const verifyPatchScript = await fs.readFile(path.join(rootPath, "scripts/verify-codex-patch.mjs"), "utf8");
  const smokeScript = await fs.readFile(path.join(rootPath, "scripts/smoke-codex-docker.mjs"), "utf8");
  const patchPath = path.join(rootPath, requiredString(versions.codexPatchFile));
  const patch = await fs.readFile(patchPath, "utf8");
  const bundledBwrap = await readFileIfPresent(
    path.join(
      rootPath,
      "node_modules/@openai/codex-linux-x64/vendor/x86_64-unknown-linux-musl/codex-resources/bwrap"
    )
  );
  const dockerRuntimeManager = await fs.readFile(path.resolve(process.cwd(), "src/docker/dockerRuntimeManager.ts"), "utf8");
  const generatedReadme = await fs.readFile(path.resolve(process.cwd(), "src/codex/generated/README.md"), "utf8");
  const selectedSchema = await readJson(
    path.resolve(process.cwd(), `src/codex/generated/codex-app-server-${codexVersion}.selected.schema.json`)
  );

  assert.match(dockerfile, new RegExp(`^ARG CODEX_VERSION=${escapeRegExp(codexVersion)}$`, "mu"));
  assert.match(dockerfile, new RegExp(`^ARG IMAGE_VERSION=${escapeRegExp(imageVersion)}$`, "mu"));
  assert.match(dockerfile, /LABEL org\.opencontainers\.image\.version="\$\{IMAGE_VERSION\}"/u);
  assert.match(dockerfile, /LABEL ai\.yp-live-workflow\.codex\.version="\$\{CODEX_VERSION\}"/u);
  assert.match(dockerfile, /COPY versions\.json \/opt\/yp-live-workflow\/runtime-versions\.json/u);
  assert.match(
    dockerfile,
    new RegExp(`^ARG CODEX_SOURCE_COMMIT=${escapeRegExp(requiredString(versions.codexSourceCommit))}$`, "mu")
  );
  assert.match(
    dockerfile,
    new RegExp(`^ARG CODEX_SOURCE_SHA256=${escapeRegExp(requiredString(versions.codexSourceSha256))}$`, "mu")
  );
  assert.match(
    dockerfile,
    new RegExp(`^ARG CODEX_PATCH_REVISION=${escapeRegExp(requiredString(versions.codexPatchRevision))}$`, "mu")
  );
  assert.match(
    dockerfile,
    new RegExp(`^ARG CODEX_PATCH_SHA256=${escapeRegExp(requiredString(versions.codexPatchSha256))}$`, "mu")
  );
  assert.match(
    dockerfile,
    new RegExp(`^ARG OPENAI_STREAM_IDLE_TIMEOUT_MS=${String(versions.openAiStreamIdleTimeoutMs)}$`, "mu")
  );
  assert.match(
    dockerfile,
    new RegExp(
      `^ARG CODEX_BUNDLED_BWRAP_SHA256=${escapeRegExp(requiredString(versions.codexBundledBwrapSha256))}$`,
      "mu"
    )
  );
  assert.match(
    dockerfile,
    new RegExp(`^ARG CODEX_RUST_VERSION=${escapeRegExp(requiredString(versions.codexRustVersion))}$`, "mu")
  );
  assert.match(
    dockerfile,
    new RegExp(
      `^ARG CODEX_RESOLVED_CARGO_LOCK_SHA256=${escapeRegExp(requiredString(versions.codexResolvedCargoLockSha256))}$`,
      "mu"
    )
  );
  for (const [argumentName, versionKey] of [
    ["CODEX_RUSTY_V8_VERSION", "codexRustyV8Version"],
    ["CODEX_RUSTY_V8_ARCHIVE_URL", "codexRustyV8ArchiveUrl"],
    ["CODEX_RUSTY_V8_ARCHIVE_SHA256", "codexRustyV8ArchiveSha256"],
    ["CODEX_RUSTY_V8_BINDING_URL", "codexRustyV8BindingUrl"],
    ["CODEX_RUSTY_V8_BINDING_SHA256", "codexRustyV8BindingSha256"],
  ] as const) {
    assert.match(
      dockerfile,
      new RegExp(`^ARG ${argumentName}=${escapeRegExp(requiredString(versions[versionKey]))}$`, "mu")
    );
  }
  assert.match(
    requiredString(versions.codexRustyV8ArchiveUrl),
    new RegExp(
      `rusty-v8-v${escapeRegExp(requiredString(versions.codexRustyV8Version))}/librusty_v8_release_x86_64-unknown-linux-musl\\.a\\.gz$`,
      "u"
    )
  );
  assert.match(
    requiredString(versions.codexRustyV8BindingUrl),
    new RegExp(
      `rusty-v8-v${escapeRegExp(requiredString(versions.codexRustyV8Version))}/src_binding_release_x86_64-unknown-linux-musl\\.rs$`,
      "u"
    )
  );
  assert.match(requiredString(versions.codexRustyV8ArchiveSha256), /^[0-9a-f]{64}$/u);
  assert.match(requiredString(versions.codexRustyV8BindingSha256), /^[0-9a-f]{64}$/u);
  assert.match(requiredString(versions.codexResolvedCargoLockSha256), /^[0-9a-f]{64}$/u);
  assert.equal(versions.backgroundTerminalMaxTimeoutMs, 1_800_000);
  assert.equal(versions.openAiStreamIdleTimeoutMs, 900_000);
  assert.deepEqual(versions.flexServiceTierModels, [
    "gpt-5.6-sol",
    "gpt-5.6-terra",
    "gpt-5.6-luna",
  ]);
  assert.equal(
    createHash("sha256").update(patch).digest("hex"),
    requiredString(versions.codexPatchSha256)
  );
  assert.match(requiredString(versions.codexBundledBwrapSha256), /^[0-9a-f]{64}$/u);
  if (bundledBwrap !== undefined) {
    assert.equal(
      createHash("sha256").update(bundledBwrap).digest("hex"),
      requiredString(versions.codexBundledBwrapSha256)
    );
  }
  assert.match(requiredString(versions.codexSourceUrl), new RegExp(requiredString(versions.codexSourceCommit), "u"));
  assert.match(patch, /FIRST_BACKGROUND_POLL_YIELD_TIME_MS: u64 = 120_000/u);
  assert.match(patch, /SECOND_BACKGROUND_POLL_YIELD_TIME_MS: u64 = 600_000/u);
  assert.match(patch, /eidosoma_progressive_poll_uses_server_controlled_schedule/u);
  assert.match(patch, /YP_LIVE_WORKFLOW_OPENAI_STREAM_IDLE_TIMEOUT_MS: u64 = 900_000/u);
  assert.match(patch, /eidosoma_openai_stream_idle_timeout_is_fifteen_minutes/u);
  assert.match(patch, /eidosoma_flex_catalog_augmentation_is_allowlisted_and_idempotent/u);
  assert.match(patch, /eidosoma_flex_catalog_is_limited_to_openai_managers/u);
  assert.match(patch, /eidosoma_flex_catalog_augmentation_is_limited_to_openai_provider/u);
  assert.match(patch, /eidosoma_flex_remote_catalog_augmentation_is_limited_to_openai_provider/u);
  assert.match(patch, /eidosoma_augment_flex_service_tiers\(&mut existing_models\)/u);
  assert.match(patch, /if self\.info\.is_openai\(\)/u);
  assert.match(patch, /is_openai_provider: bool/u);
  assert.match(patch, /if self\.is_openai_provider/u);
  assert.doesNotMatch(
    patch,
    /impl StaticModelsManager[\s\S]{0,500}eidosoma_augment_flex_service_tiers/u
  );
  assert.match(patch, /\["gpt-5\.6-sol", "gpt-5\.6-terra", "gpt-5\.6-luna"\]/u);
  assert.match(dockerfile, /git apply --check \/tmp\/background-terminal-progressive-poll\.patch/u);
  assert.match(
    dockerfile,
    /resolved_codex_rust_version=.*codex-rs\/rust-toolchain\.toml[\s\S]*?test "\$\{resolved_codex_rust_version\}" = "\$\{CODEX_RUST_VERSION\}"/u
  );
  assert.match(dockerfile, /rustup toolchain install "\$\{CODEX_RUST_VERSION\}" --profile minimal/u);
  assert.match(
    dockerfile,
    /rustup target add --toolchain "\$\{CODEX_RUST_VERSION\}" x86_64-unknown-linux-musl/u
  );
  assert.match(
    dockerfile,
    /require\.resolve\("@openai\/codex-linux-x64\/package\.json", \{ paths: \[packageDir\] \}\)/u
  );
  assert.doesNotMatch(
    dockerfile,
    /codex_platform_dir="\$\(npm root -g\)\/@openai\/codex-linux-x64/u
  );
  assert.match(
    dockerfile,
    /npm install -g "@openai\/codex@\$\{CODEX_VERSION\}"[\s\S]*?rm -f "\$\{codex_stock_native_path\}"[\s\S]*?npm install --prefix \/opt\/yp-live-workflow-node-tools/u
  );
  assert.match(dockerfile, /test ! -e "\$\{codex_native_path\}"/u);
  assert.match(dockerfile, /export CODEX_BWRAP_SHA256="\$\{installed_bwrap_sha256\}"/u);
  assert.match(dockerfile, /export AWS_LC_SYS_NO_JITTER_ENTROPY=1/u);
  assert.match(dockerfile, /export AWS_LC_SYS_NO_JITTER_ENTROPY_x86_64_unknown_linux_musl=1/u);
  assert.match(dockerfile, /rusty_v8_bazel\.py resolved-v8-crate-version/u);
  assert.match(dockerfile, /export RUSTY_V8_ARCHIVE="\$\{rusty_v8_archive\}"/u);
  assert.match(dockerfile, /export RUSTY_V8_SRC_BINDING_PATH="\$\{rusty_v8_binding\}"/u);
  assert.match(
    dockerfile,
    /cargo "\+\$\{CODEX_RUST_VERSION\}" fetch --target x86_64-unknown-linux-musl[\s\S]*?test "\$\{resolved_cargo_lock_sha256\}" = "\$\{CODEX_RESOLVED_CARGO_LOCK_SHA256\}"/u
  );
  assert.match(
    dockerfile,
    /cargo "\+\$\{CODEX_RUST_VERSION\}" test --locked --target x86_64-unknown-linux-musl -p codex-core eidosoma_progressive_poll/u
  );
  assert.match(
    dockerfile,
    /cargo "\+\$\{CODEX_RUST_VERSION\}" test --locked -p codex-model-provider-info eidosoma_openai_stream_idle_timeout/u
  );
  assert.match(
    dockerfile,
    /cargo "\+\$\{CODEX_RUST_VERSION\}" test --locked -p codex-models-manager eidosoma_flex_catalog/u
  );
  assert.match(
    dockerfile,
    /cargo "\+\$\{CODEX_RUST_VERSION\}" test --locked -p codex-model-provider eidosoma_flex_/u
  );
  assert.match(
    dockerfile,
    /cargo "\+\$\{CODEX_RUST_VERSION\}" build --locked --release --target x86_64-unknown-linux-musl -p codex-cli --bin codex/u
  );
  assert.match(
    dockerfile,
    /if \[ "\$\{CODEX_RUST_VERSION\}" != "\$\{RUST_VERSION\}" \]; then rustup toolchain uninstall "\$\{CODEX_RUST_VERSION\}"; fi/u
  );
  assert.match(dockerfile, /strip --strip-debug --strip-unneeded "\$\{patched_codex_path\}"/u);
  assert.match(dockerfile, /\/opt\/yp-live-workflow\/codex-patches\.json/u);
  assert.match(
    dockerfile,
    /openAiStreamIdleTimeoutMs: \$openAiStreamIdleTimeoutMs, flexServiceTierModels: \["gpt-5\.6-sol", "gpt-5\.6-terra", "gpt-5\.6-luna"\]/u
  );
  assert.match(
    buildScript,
    /\[\s*"OPENAI_STREAM_IDLE_TIMEOUT_MS",\s*String\(requiredPositiveInteger\(versions\.openAiStreamIdleTimeoutMs/u
  );
  assert.match(smokeScript, /openAiStreamIdleTimeoutMs: versions\.openAiStreamIdleTimeoutMs/u);
  assert.match(smokeScript, /flexServiceTierModels: versions\.flexServiceTierModels/u);
  assert.match(workflow, /scripts\/build-codex-image\.mjs/u);
  assert.match(workflow, /versions\.json/u);
  assert.match(workflow, /console\.log\(v\.imageVersion\)/u);
  assert.match(workflow, /does not match versions\.json imageVersion/u);
  assert.match(workflow, /^  RESEARCHER_RUNTIME_IMAGE: ghcr\.io\/yp-live-workflow\/researcher-runtime$/mu);
  assert.match(workflow, /^      promote_prod:$/mu);
  assert.match(workflow, /PROMOTE_PROD_INPUT: \$\{\{ github\.event\.inputs\.promote_prod \|\| 'false' \}\}/u);
  assert.match(workflow, /promote_prod=true requires running from a release tag/u);
  assert.match(workflow, /promote_prod=true requires a researcher runtime release tag/u);
  assert.match(workflow, /prod_tag=\$\{RESEARCHER_RUNTIME_IMAGE\}:prod/u);
  assert.match(workflow, /promote_prod=\$\{promote_prod\}/u);
  assert.match(workflow, /steps\.meta\.outputs\.promote_prod/u);
  assert.match(workflow, /steps\.meta\.outputs\.prod_tag/u);
  assert.match(workflow, /Pull published immutable image for promotion/u);
  assert.match(workflow, /docker pull "\$\{\{ steps\.meta\.outputs\.version_tag \}\}"/u);
  assert.match(workflow, /docker tag "\$\{\{ steps\.meta\.outputs\.version_tag \}\}" "\$\{\{ steps\.meta\.outputs\.prod_tag \}\}"/u);
  assert.doesNotMatch(workflow, /tags\+=\(--tag "\$\{\{ steps\.meta\.outputs\.prod_tag \}\}"\)/u);
  assert.match(workflow, /docker push "\$\{\{ steps\.meta\.outputs\.prod_tag \}\}"/u);
  assert.match(workflow, /researcher-runtime-v\*/u);
  assert.doesNotMatch(workflow, /v\.codexVersion,\s*v\.codexPatchRevision/u);
  assert.doesNotMatch(workflow, /ghcr\.io\/yp-live-workflow\/codex-app-server/u);
  assert.match(buildScript, /YP_LIVE_WORKFLOW_CODEX_STABLE_TAG/u);
  assert.match(buildScript, /researcherRuntimeImageVersion\(versions\)/u);
  assert.match(buildScript, /imageVersion must use YYYYMMDD\.N CalVer format/u);
  assert.match(buildScript, /--push and --promote-prod are separate operations/u);
  assert.match(buildScript, /publish\s*\? \[remoteImmutableImage\]/u);
  assert.match(smokeScript, /yp-live-workflow\/researcher-runtime/u);
  assert.match(smokeScript, /`\$\{localImageRepo\}:\$\{versions\.imageVersion\}`/u);
  assert.doesNotMatch(smokeScript, /YP_LIVE_WORKFLOW_CODEX_STABLE_TAG/u);
  assert.match(smokeScript, /Researcher runtime versions manifest/u);
  for (const buildArgName of [
    "CODEX_SOURCE_COMMIT",
    "CODEX_SOURCE_URL",
    "CODEX_SOURCE_SHA256",
    "CODEX_PATCH_REVISION",
    "CODEX_PATCH_SHA256",
    "CODEX_BUNDLED_BWRAP_SHA256",
    "CODEX_RUST_VERSION",
    "CODEX_RESOLVED_CARGO_LOCK_SHA256",
    "CODEX_RUSTY_V8_VERSION",
    "CODEX_RUSTY_V8_ARCHIVE_URL",
    "CODEX_RUSTY_V8_ARCHIVE_SHA256",
    "CODEX_RUSTY_V8_BINDING_URL",
    "CODEX_RUSTY_V8_BINDING_SHA256",
    "BACKGROUND_TERMINAL_MAX_TIMEOUT_MS",
  ]) {
    assert.match(buildScript, new RegExp(`"${buildArgName}"`, "u"));
  }
  assert.match(buildScript, /NODE_MAJOR/u);
  assert.match(buildScript, /DOCLING_VERSION/u);
  assert.match(buildScript, /DOCLING_MODELS_PATH/u);
  assert.match(buildScript, /CHROME_FOR_TESTING_VERSION/u);
  assert.match(buildScript, /CHROME_FOR_TESTING_REVISION/u);
  assert.match(buildScript, /CHROME_FOR_TESTING_CHROME_LINUX64_URL/u);
  assert.match(buildScript, /CHROME_FOR_TESTING_CHROMEDRIVER_LINUX64_URL/u);
  assert.match(buildScript, /PYTHON_PLAYWRIGHT_VERSION/u);
  assert.match(buildScript, /SELENIUM_VERSION/u);
  assert.match(buildScript, /PUPPETEER_CORE_VERSION/u);
  assert.match(buildScript, /PLAYWRIGHT_CORE_VERSION/u);
  assert.match(buildScript, /ONNXRUNTIME_GPU_VERSION/u);
  assert.match(buildScript, /TORCHVISION_VERSION/u);
  for (const buildArgName of [
    "CARGO_LLVM_COV_VERSION",
    "CARGO_EXPAND_VERSION",
    "CARGO_OUTDATED_VERSION",
    "CARGO_WATCH_VERSION",
    "CARGO_BLOAT_VERSION",
    "WASM_PACK_VERSION",
    "CBINDGEN_VERSION",
    "BINDGEN_CLI_VERSION",
    "CARGO_SEMVER_CHECKS_VERSION",
    "JUST_VERSION",
    "QUARTO_VERSION",
    "QUARTO_LINUX_AMD64_URL",
    "QUARTO_LINUX_AMD64_SHA256",
  ]) {
    assert.match(buildScript, new RegExp(`\\["${buildArgName}"`, "u"));
  }
  assert.match(buildScript, /requireExistingImage\(\s*localImmutableImage/su);
  assert.match(buildScript, /run\(dockerBin, \["pull", remoteImmutableImage\]\)/u);
  assert.match(buildScript, /run\(dockerBin, \["push", remoteProdImage\]\)/u);
  assert.doesNotMatch(buildScript, /tags\.filter\(.*startsWith/su);
  assert.match(buildScript, /\$\{localRepo\}:\$\{stableTag\}/u);
  assert.match(dockerRuntimeManager, /OfficialCodexAppServerImage = "yp-live-workflow\/researcher-runtime:prod"/u);
  assert.match(stringValue(rootScripts["docker:codex:build"]) ?? "", /scripts\/build-codex-image\.mjs/u);
  assert.match(stringValue(rootScripts["docker:codex:publish"]) ?? "", /scripts\/build-codex-image\.mjs --push/u);
  assert.match(
    stringValue(rootScripts["docker:codex:promote"]) ?? "",
    /scripts\/build-codex-image\.mjs --promote-prod/u
  );
  assert.doesNotMatch(stringValue(rootScripts["docker:codex:promote"]) ?? "", /--push/u);
  assert.match(stringValue(rootScripts["docker:codex:check-versions"]) ?? "", /scripts\/check-codex-image-versions\.mjs/u);
  assert.match(stringValue(rootScripts["docker:codex:verify-patch"]) ?? "", /scripts\/verify-codex-patch\.mjs/u);
  assert.match(verifyPatchScript, /git.*apply.*--check/su);
  assert.match(verifyPatchScript, /Patch checksum mismatch/u);
  assert.match(smokeScript, /Codex progressive polling patch manifest/u);
  assert.match(smokeScript, /Codex progressive polling binary marker/u);
  assert.match(smokeScript, /Codex patched binary is stripped/u);
  assert.match(smokeScript, /Codex bundled bwrap digest/u);
  assert.match(generatedReadme, new RegExp(`${escapeRegExp("@openai/codex` ")}${escapeRegExp(codexVersion)}`, "u"));
  assert.equal(selectedSchema.generatedFrom, `@openai/codex@${codexVersion}`);

  const integrationPath = path.join(rootPath, "apps/api/src/tests/integration");
  const manualIntegrationFiles = (await fs.readdir(integrationPath))
    .filter((fileName) => fileName.endsWith(".manual.ts"));
  const pinnedImageSources = [
    await fs.readFile(path.join(rootPath, "AGENTS.md"), "utf8"),
    ...await Promise.all(
      manualIntegrationFiles.map((fileName) => fs.readFile(path.join(integrationPath, fileName), "utf8"))
    ),
  ].join("\n");
  assert.doesNotMatch(pinnedImageSources, /researcher-runtime:[0-9][A-Za-z0-9._-]*/u);
  assert.match(pinnedImageSources, /yp-live-workflow\/researcher-runtime:prod/u);
});

test("Codex image build tags stay local unless publishing is explicit", async () => {
  const rootPath = path.resolve(process.cwd(), "../..");
  const versions = await readJson(path.join(rootPath, "infra/docker/codex-app-server/versions.json"));
  const imageVersion = requiredString(versions.imageVersion);
  const printTags = (args: string[], overrides: NodeJS.ProcessEnv = {}) => {
    const env: NodeJS.ProcessEnv = { ...process.env };
    delete env.YP_LIVE_WORKFLOW_CODEX_IMAGE_REPO;
    delete env.YP_LIVE_WORKFLOW_CODEX_LOCAL_IMAGE_REPO;
    delete env.YP_LIVE_WORKFLOW_CODEX_STABLE_TAG;
    Object.assign(env, overrides);
    return spawnSync(process.execPath, [path.join(rootPath, "scripts/build-codex-image.mjs"), ...args], {
      cwd: rootPath,
      encoding: "utf8",
      env,
    });
  };

  assert.deepEqual(printTags(["--print-tags"]).stdout.trim().split("\n"), [
    `yp-live-workflow/researcher-runtime:${imageVersion}`,
    "yp-live-workflow/researcher-runtime:prod",
    "yp-live-workflow/researcher-runtime:dev",
  ]);
  assert.deepEqual(printTags(["--push", "--print-tags"]).stdout.trim().split("\n"), [
    `ghcr.io/yp-live-workflow/researcher-runtime:${imageVersion}`,
  ]);
  assert.deepEqual(printTags(["--promote-prod", "--print-tags"]).stdout.trim().split("\n"), [
    "ghcr.io/yp-live-workflow/researcher-runtime:prod",
  ]);
  assert.deepEqual(
    printTags(["--push", "--print-tags"], {
      YP_LIVE_WORKFLOW_CODEX_IMAGE_REPO: "registry.example/yp-live-workflow/researcher-runtime",
      YP_LIVE_WORKFLOW_CODEX_LOCAL_IMAGE_REPO: "registry.example/yp-live-workflow/researcher-runtime",
    }).stdout.trim().split("\n"),
    [`registry.example/yp-live-workflow/researcher-runtime:${imageVersion}`]
  );
  const invalidPromotion = printTags(["--push", "--promote-prod", "--print-tags"]);
  assert.equal(invalidPromotion.status, 2);
  assert.match(invalidPromotion.stderr, /--push and --promote-prod are separate operations/u);
  const invalidPrint = printTags(["--print-tags", "--unknown"]);
  assert.equal(invalidPrint.status, 2);
  assert.match(invalidPrint.stderr, /Unknown arguments: --unknown/u);
});

test("Codex image build, publication, and promotion reuse existing immutable images", async (context) => {
  const rootPath = path.resolve(process.cwd(), "../..");
  const versions = await readJson(path.join(rootPath, "infra/docker/codex-app-server/versions.json"));
  const imageVersion = requiredString(versions.imageVersion);
  const temporaryPath = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-codex-publish-test-"));
  const fakeDockerPath = path.join(temporaryPath, "fake-docker.mjs");
  const logPath = path.join(temporaryPath, "docker-calls.jsonl");
  context.after(() => fs.rm(temporaryPath, { recursive: true, force: true }));
  await fs.writeFile(
    fakeDockerPath,
    [
      "#!/usr/bin/env node",
      "import fs from 'node:fs';",
      "fs.appendFileSync(process.env.YP_LIVE_WORKFLOW_FAKE_DOCKER_LOG, JSON.stringify(process.argv.slice(2)) + '\\n');",
      "if (process.env.YP_LIVE_WORKFLOW_FAKE_DOCKER_FAIL_INSPECT === '1' && process.argv[2] === 'image' && process.argv[3] === 'inspect') process.exit(1);",
    ].join("\n"),
    "utf8"
  );
  await fs.chmod(fakeDockerPath, 0o755);

  const runMode = (args: string[], overrides: NodeJS.ProcessEnv = {}) => {
    const env: NodeJS.ProcessEnv = {
      ...process.env,
      YP_LIVE_WORKFLOW_DOCKER_BIN: fakeDockerPath,
      YP_LIVE_WORKFLOW_FAKE_DOCKER_LOG: logPath,
      ...overrides,
    };
    delete env.YP_LIVE_WORKFLOW_CODEX_STABLE_TAG;
    if (!("YP_LIVE_WORKFLOW_CODEX_IMAGE_REPO" in overrides)) {
      delete env.YP_LIVE_WORKFLOW_CODEX_IMAGE_REPO;
    }
    if (!("YP_LIVE_WORKFLOW_CODEX_LOCAL_IMAGE_REPO" in overrides)) {
      delete env.YP_LIVE_WORKFLOW_CODEX_LOCAL_IMAGE_REPO;
    }
    return spawnSync(process.execPath, [path.join(rootPath, "scripts/build-codex-image.mjs"), ...args], {
      cwd: rootPath,
      encoding: "utf8",
      env,
    });
  };
  const calls = async (): Promise<string[][]> => (await fs.readFile(logPath, "utf8"))
    .trim()
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line) as string[]);

  assert.equal(runMode(["--push"]).status, 0);
  assert.deepEqual(await calls(), [
    ["image", "inspect", `yp-live-workflow/researcher-runtime:${imageVersion}`],
    [
      "tag",
      `yp-live-workflow/researcher-runtime:${imageVersion}`,
      `ghcr.io/yp-live-workflow/researcher-runtime:${imageVersion}`,
    ],
    ["push", `ghcr.io/yp-live-workflow/researcher-runtime:${imageVersion}`],
  ]);

  await fs.writeFile(logPath, "", "utf8");
  assert.equal(runMode(["--promote-prod"]).status, 0);
  assert.deepEqual(await calls(), [
    ["pull", `ghcr.io/yp-live-workflow/researcher-runtime:${imageVersion}`],
    [
      "tag",
      `ghcr.io/yp-live-workflow/researcher-runtime:${imageVersion}`,
      "ghcr.io/yp-live-workflow/researcher-runtime:prod",
    ],
    ["push", "ghcr.io/yp-live-workflow/researcher-runtime:prod"],
  ]);

  await fs.writeFile(logPath, "", "utf8");
  const sharedRepo = "registry.example/yp-live-workflow/researcher-runtime";
  assert.equal(runMode(["--push"], {
    YP_LIVE_WORKFLOW_CODEX_IMAGE_REPO: sharedRepo,
    YP_LIVE_WORKFLOW_CODEX_LOCAL_IMAGE_REPO: sharedRepo,
  }).status, 0);
  assert.deepEqual(await calls(), [
    ["image", "inspect", `${sharedRepo}:${imageVersion}`],
    ["push", `${sharedRepo}:${imageVersion}`],
  ]);

  await fs.writeFile(logPath, "", "utf8");
  const missingLocalImage = runMode(["--push"], { YP_LIVE_WORKFLOW_FAKE_DOCKER_FAIL_INSPECT: "1" });
  assert.equal(missingLocalImage.status, 1);
  assert.match(missingLocalImage.stderr, /is missing; build and canary it before publishing/u);
  assert.deepEqual(await calls(), [
    ["image", "inspect", `yp-live-workflow/researcher-runtime:${imageVersion}`],
  ]);

  await fs.writeFile(logPath, "", "utf8");
  assert.equal(runMode([]).status, 0);
  assert.deepEqual(await calls(), [
    ["image", "inspect", `yp-live-workflow/researcher-runtime:${imageVersion}`],
    [
      "tag",
      `yp-live-workflow/researcher-runtime:${imageVersion}`,
      "yp-live-workflow/researcher-runtime:prod",
    ],
    [
      "tag",
      `yp-live-workflow/researcher-runtime:${imageVersion}`,
      "yp-live-workflow/researcher-runtime:dev",
    ],
  ]);

  await fs.writeFile(logPath, "", "utf8");
  assert.equal(runMode([], { YP_LIVE_WORKFLOW_FAKE_DOCKER_FAIL_INSPECT: "1" }).status, 0);
  const buildCalls = await calls();
  assert.deepEqual(buildCalls[0], [
    "image",
    "inspect",
    `yp-live-workflow/researcher-runtime:${imageVersion}`,
  ]);
  assert.equal(buildCalls[1]?.[0], "build");
  assert.equal(buildCalls[1]?.includes(`yp-live-workflow/researcher-runtime:${imageVersion}`), true);
  assert.equal(buildCalls[1]?.includes("yp-live-workflow/researcher-runtime:prod"), true);
  assert.equal(buildCalls[1]?.includes("yp-live-workflow/researcher-runtime:dev"), true);
});

async function readJson(filePath: string): Promise<Record<string, unknown>> {
  return JSON.parse(await fs.readFile(filePath, "utf8")) as Record<string, unknown>;
}

async function readFileIfPresent(filePath: string): Promise<Buffer | undefined> {
  try {
    return await fs.readFile(filePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return undefined;
    }
    throw error;
  }
}

function stringValue(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function jsonRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function requiredString(value: unknown): string {
  assert.equal(typeof value, "string");
  assert.notEqual(value, "");
  return value as string;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}
