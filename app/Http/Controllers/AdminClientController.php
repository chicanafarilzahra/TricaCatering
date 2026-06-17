<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;

class AdminClientController extends Controller
{
    public function index()
    {
        return Client::latest()->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:30',
            'address' => 'nullable|string',
            'email' => 'nullable|email',
        ]);

        $client = Client::create([
            'name' => $request->name,
            'phone' => $request->phone,
            'address' => $request->address,
            'email' => $request->email,
        ]);

        return response()->json([
            'message' => 'Client berhasil ditambahkan',
            'data' => $client
        ], 201);
    }

    public function show(int $id)
    {
        return Client::findOrFail($id);
    }

    public function update(
        Request $request,
        int $id
    ) {
        $client = Client::findOrFail($id);

        $client->update([
            'name' => $request->name,
            'phone' => $request->phone,
            'address' => $request->address,
            'email' => $request->email,
        ]);

        return response()->json([
            'message' => 'Client berhasil diupdate',
            'data' => $client
        ]);
    }

    public function destroy(int $id)
    {
        Client::destroy($id);

        return response()->json([
            'message' => 'Client berhasil dihapus'
        ]);
    }
}