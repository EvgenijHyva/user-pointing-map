import hashlib

def generate_user_color(value: str) -> str:
	"""Automatically decide color hex-code based on slice of hash."""
	hash = hashlib.sha256(f"{value}".encode()).hexdigest()
	color = f"#{hash[:6]}"
	return color