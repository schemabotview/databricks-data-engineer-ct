"""One local session for every test, in a scratch copy of what it reads."""
import os
import shutil
from pathlib import Path

import pytest

from retail.session import build_session

PROJECT = Path.cwd()


@pytest.fixture(scope="session")
def spark(tmp_path_factory):
    work = tmp_path_factory.mktemp("project")
    shutil.copytree(PROJECT / "conf", work / "conf")
    shutil.copytree(PROJECT / "data/reference", work / "data/reference")
    (work / "data/landing/orders").mkdir(parents=True)
    for sample in sorted((PROJECT / "data/samples").glob("orders-*.csv")):
        shutil.copy(sample, work / "data/landing/orders")
    os.chdir(work)                     # tables and metastore land here
    session = build_session("tests")
    yield session
    session.stop()
    os.chdir(PROJECT)
