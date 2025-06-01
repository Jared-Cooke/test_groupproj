from fastapi import APIRouter, Request

router = APIRouter()


@router.get("/searchitems")
async def get_items(request: Request, search: str = ""):
    db = request.app.state.db
    items = await db.search_items(search)
    return items
