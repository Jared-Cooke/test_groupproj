import importlib
import pkgutil
from fastapi import FastAPI
from database_functions import DBHandler
import uvicorn
import routers
from contextlib import asynccontextmanager


class APIHandler:
    def __init__(self):
        self.app = FastAPI()

        @asynccontextmanager
        async def lifespan(app: FastAPI):
            # Honestly very fickle, but essentially according to the docs, we can use this to maintain the db state across the routers and the overall system context
            db = DBHandler("./database.db")
            await db.connect()
            app.state.db = db
            yield
            await db.close()

        self.app = FastAPI(lifespan=lifespan)
        endpoint_count = self.register_routes()

        print(f"Imported {endpoint_count} endpoints.")

    def register_routes(self):
        imported_endpoints = 0
        for _, module_name, _ in pkgutil.iter_modules(
            routers.__path__
        ):  # Basically just nulling out values 1,3 so we can grab the name
            try:
                module = importlib.import_module(f"routers.{module_name}")
                router = getattr(
                    module, "router", None
                )  # Grabs the router module, or just gets used as a bool if it fails.
                if router:
                    self.app.include_router(router, prefix=f"/{module_name}")
                    imported_endpoints += 1

            except ImportError:  # Catches errors so we can skip them
                continue

        return imported_endpoints

    def get_app(self) -> FastAPI:
        return self.app


app = APIHandler().get_app()

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=False)
