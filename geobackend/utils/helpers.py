import hashlib

def generate_user_color(value: str) -> str:
	hash = hashlib.sha256(f"{value}".encode()).hexdigest()
	color = f"#{hash[:6]}"
	return color