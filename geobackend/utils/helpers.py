import hashlib

def generate_user_color(id: int) -> str:
	hash = hashlib.sha256(f"{id}".encode()).hexdigest()
	color = f"#{hash[:6]}"
	return color