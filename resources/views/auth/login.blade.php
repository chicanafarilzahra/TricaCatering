<!DOCTYPE html>
<html>
<head>
    <title>Login</title>
</head>
<body>

<h2>Login Admin</h2>

@if(session('error'))

    <p>{{ session('error') }}</p>

@endif

<form action="/login" method="POST">

    @csrf

    <input
        type="email"
        name="email"
        placeholder="Email"
    >

    <br><br>

    <input
        type="password"
        name="password"
        placeholder="Password"
    >

    <br><br>

    <button type="submit">
        Login
    </button>

</form>

</body>
</html>