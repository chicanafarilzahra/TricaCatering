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

            'name' =>
                'required',

            'phone' =>
                'required',
        ]);

        $client = Client::create([

            'name' =>
                $request->name,

            'phone' =>
                $request->phone,

            'address' =>
                $request->address,

            'email' =>
                $request->email,
        ]);

        return response()->json([
            'message' =>
                'Client berhasil ditambahkan',

            'data' => $client
        ]);
    }


    public function show($id)
    {
        return Client::findOrFail($id);
    }


    public function update(
        Request $request,
        $id
    ) {

        $client = Client::findOrFail($id);

        $client->update($request->all());

        return response()->json([
            'message' =>
                'Client berhasil diupdate',

            'data' => $client
        ]);
    }



    public function destroy($id)
    {
        Client::destroy($id);

        return response()->json([
            'message' =>
                'Client berhasil dihapus'
        ]);
    }
}