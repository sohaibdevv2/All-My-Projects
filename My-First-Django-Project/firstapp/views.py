from django.shortcuts import render
from django.http import HttpResponse
from datetime import date

def index(request):
    # A well-structured HTML page as a single string
    template = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My First Django App</title>
</head>
<body>
    <header>
        <h1>Welcome!</h1>
    </header>
    <main>
        <p>This is my first view, returned directly from the Python code.</p>
        <ul>
            <li>Item 1</li>
            <li>Item 2</li>
        </ul>
    </main>
    <footer>
        <p>&copy; 2025 My App</p>
    </footer>
</body>
</html>
"""
    # Return the template as content argument in HTTP response
    return HttpResponse(content=template)

def get_date(request):
    today = date.today()
    template = "<html>" \
                "Today's date is {}" \
               "</html>".format(today)
    return HttpResponse(content=template)