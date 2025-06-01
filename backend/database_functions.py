# As much as I don't want to, here's the DBHandler class.
# Realistically Python could just handle this file as an import, but hey, OOP stuff am I right?
# Very strictly typed for the challenge.

import aiosqlite
from typing import Any, Optional, Union, Sequence, List
from aiosqlite import Connection


class DBHandler:
    def __init__(self, db_path: str):
        self.db_path: str = db_path
        self._conn: Optional[Connection] = None

    async def connect(self):
        if self._conn is None:
            self._conn = await aiosqlite.connect(self.db_path)
            self._conn.row_factory = aiosqlite.Row

            # Print out all tables in the database, just as a debug step. May remove later but it's useful atm
            cursor = await self._conn.execute(
                "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';"
            )
            tables = await cursor.fetchall()
            await cursor.close()

            table_names = [row["name"] for row in tables]
            print(
                f"Connected to database. Found tables: {', '.join(table_names) if table_names else 'None'}"
            )

    async def close(self):
        if self._conn is not None:
            await self._conn.close()
            self._conn = None

    async def execute(
        self,
        query: str,
        params: Optional[Union[Any, Sequence[Any]]] = None,
        fetch: bool = False,
    ) -> Optional[List[dict[str, Any]]]:
        if self._conn is None:
            raise RuntimeError("Database not connected.")

        if params is not None and not isinstance(params, (list, tuple)):
            params = (params,)

        cursor = await self._conn.execute(query, params or ())
        result: Optional[List[dict[str, Any]]] = None

        if fetch:
            rows = await cursor.fetchall()
            result = [dict(row) for row in rows]

        await self._conn.commit()
        await cursor.close()
        return result

    async def search_items(self, search_query: str) -> List[dict[str, Any]]:
        query = "SELECT * FROM items WHERE name LIKE ?"
        wildcard_query = f"%{search_query}%"
        items = await self.execute(query, (wildcard_query,), fetch=True)
        return items or []
