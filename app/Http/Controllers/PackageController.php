<?php

namespace App\Http\Controllers;

use App\Models\Package;
use Illuminate\Http\Request;

class PackageController extends Controller
{

    public function index()
    {
        return Package::latest()->get();
    }


    public function store(Request $request)
    {
        $request->validate([

            'name' =>
                'required',

            'price' =>
                'required',
        ]);

        $package = Package::create([

            'name' =>
                $request->name,

            'description' =>
                $request->description,

            'price' =>
                $request->price,

            'status' =>
                'active',
        ]);

        return response()->json([
            'message' =>
                'Package berhasil ditambahkan',

            'data' => $package
        ]);
    }

    public function show($id)
    {
        return Package::findOrFail($id);
    }


    public function update(
        Request $request,
        $id
    ) {

        $package = Package::findOrFail($id);

        $package->update($request->all());

        return response()->json([
            'message' =>
                'Package berhasil diupdate',

            'data' => $package
        ]);
    }


    public function destroy($id)
    {
        Package::destroy($id);

        return response()->json([
            'message' =>
                'Package berhasil dihapus'
        ]);
    }
}