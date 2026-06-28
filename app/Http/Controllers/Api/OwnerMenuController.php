<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class OwnerMenuController extends Controller
{
    public function index()
    {
        $menus = Menu::with('owner')
            ->where('owner_id', Auth::id())
            ->latest()
            ->get();

        return response()->json(
            $menus->map(function ($menu) {
                return [
                    'id'             => $menu->id,
                    'name'           => $menu->name,
                    'description'    => $menu->description,
                    'price'          => $menu->price,
                    'category'       => $menu->category,
                    'image'          => $menu->image,
                    'min_porsi'      => $menu->min_porsi,
                    'jenis_catering' => $menu->jenis_catering,
                    'status'         => $menu->is_active ? 'active' : 'inactive',
                    'ingredients_count' => $menu->ingredients()->count(),
                    'owner_name'     => $menu->owner->nama_catering ?? '',
                    'catering_address' => $menu->owner->alamat_catering ?? '',
                    'cateringLat'    => $menu->owner->latitude ?? null,
                    'cateringLng'    => $menu->owner->longitude ?? null,
                ];
            })
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'           => 'required|string|max:255',
            'description'    => 'nullable|string',
            'price'          => 'required|numeric',
            'category'       => 'required|string',
            'image'          => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'jenis_catering' => 'required|string|in:Harian,Insidentil',
            'min_porsi'      => 'nullable|integer|min:1',
            'min_pax'        => 'nullable|integer|min:1',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('menus', 'public');
        }

        $menu = Menu::create([
            'owner_id'       => Auth::id(),
            'name'           => $request->name,
            'description'    => $request->description,
            'price'          => $request->price,
            'category'       => $request->category,
            'image'          => $imagePath,
            'is_active'      => $request->status !== 'inactive',
            'jenis_catering' => $request->jenis_catering,
            'min_porsi'      => $request->min_pax ?? $request->min_porsi ?? 1,
        ]);

        return response()->json(['message' => 'Menu berhasil ditambahkan', 'data' => $menu], 201);
    }

    public function update(Request $request, int $id)
    {
        try {
            // ✅ Pakai Auth::id() bukan $request->owner_id
            $menu = Menu::where('id', $id)
                ->where('owner_id', Auth::id())
                ->firstOrFail();

            $request->validate([
                'name'           => 'required|string|max:255',
                'description'    => 'nullable|string',
                'price'          => 'required|numeric',
                'category'       => 'required|string',
                'image'          => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
                'jenis_catering' => 'required|string|in:Harian,Insidentil',
                'min_porsi'      => 'nullable|integer|min:1',
                'min_pax'        => 'nullable|integer|min:1',
            ]);

            $imagePath = $menu->image;
            if ($request->hasFile('image')) {
                // Hapus gambar lama
                if ($imagePath) Storage::disk('public')->delete($imagePath);
                $imagePath = $request->file('image')->store('menus', 'public');
            }

            $menu->update([
                'name'           => $request->name,
                'description'    => $request->description,
                'price'          => $request->price,
                'category'       => $request->category,
                'image'          => $imagePath,
                'is_active'      => $request->status !== 'inactive',
                'jenis_catering' => $request->jenis_catering,
                'min_porsi'      => $request->min_pax ?? $request->min_porsi ?? $menu->min_porsi,
            ]);

            return response()->json(['message' => 'Menu berhasil diupdate', 'data' => $menu]);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage(), 'line' => $e->getLine()], 500);
        }
    }

    public function destroy(int $id)
    {
        $menu = Menu::where('id', $id)
            ->where('owner_id', Auth::id())
            ->firstOrFail();

        if ($menu->image) Storage::disk('public')->delete($menu->image);

        $menu->delete();

        return response()->json(['message' => 'Menu berhasil dihapus']);
    }
}