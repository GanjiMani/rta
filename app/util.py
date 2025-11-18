import random
import string

def generate_unique_folio_number(investor_id: int, scheme_id: str, length=4):
    """
    Generate a unique folio number for the given investor and scheme.
    The folio number format is: 'F' + investor_id + scheme_id + random alphanumeric string

    Args:
        investor_id (int): The investor's unique ID.
        scheme_id (str): The scheme ID.
        length (int): Length of the random alphanumeric string to append.

    Returns:
        str: Generated unique folio number.
    """
    random_part = ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))
    return f"F{investor_id}{scheme_id}{random_part}"
