<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use App\Models\MenuIngredient;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class MenuController extends Controller
{
    private function authUser(): User
    {
        /** @var User $user */
        $user = auth()->user();
        return $user;
    }

    /* GET /owner/menus */
    public function index(): JsonResponse
    {
        $user = $this->authUser();

        $menus = Menu::withCount('ingredients')
            ->where('owner_id', $user->id)
            ->latest()
            ->get();

        return response()->json($menus);
    }

    /* GET /owner/menus/{menu}/ingredients */
    public function ingredients(Menu $menu): JsonResponse
    {
        $user = $this->authUser();

        abort_if($menu->owner_id !== $user->id, 403);

        $items = $menu->ingredients()->with('stock')->get();

        return response()->json($items);
    }

    /* POST /owner/menus */
    /* POST /owner/menus */
public function store(Request $request): JsonResponse
{
    if (is_string($request->ingredients)) {
        $request->merge([
            'ingredients' => json_decode($request->ingredients, true) ?? []
        ]);
    }
    // debug sementara
    \Log::info('auth user id: ' . ($user?->id ?? 'NULL'));
    \Log::info('token: ' . $request->bearerToken());

    $user = $this->authUser();

    $validated = $request->validate([
        'name'                          => 'required|string|max:255',
        'description'                   => 'nullable|string',
        'category'                      => 'nullable|string|max:100',
        'price'                         => 'nullable|numeric|min:0',
        'min_pax'                       => 'nullable|integer|min:1',
        'status'                        => 'in:active,inactive',
        'image'                         => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        'ingredients'                   => 'nullable|array',
        'ingredients.*.stock_id'        => 'required|exists:stocks,id',
        'ingredients.*.qty_per_portion' => 'required|numeric|min:0.001',
    ]);

    $imagePath = null;
    if ($request->hasFile('image')) {
        $imagePath = $request->file('image')->store('menus', 'public');
    }

    $menu = Menu::create(array_merge($validated, [
    'owner_id'  => $user->id,
    'is_active' => ($validated['status'] ?? 'active') === 'active',
    'image'     => $imagePath,
    'category'  => $validated['category'] ?? '',
]));

    $this->syncIngredients($menu, $request->input('ingredients', []));
    return response()->json($menu->load('ingredients'), 201);
}

/* PUT /owner/menus/{menu} */
public function update(Request $request, Menu $menu): JsonResponse
{
    if (is_string($request->ingredients)) {
        $request->merge([
            'ingredients' => json_decode($request->ingredients, true) ?? []
        ]);
    }
    $user = $this->authUser();
    abort_if($menu->owner_id !== $user->id, 403);

    $validated = $request->validate([
        'name'                          => 'required|string|max:255',
        'description'                   => 'nullable|string',
        'category'                      => 'nullable|string|max:100',
        'price'                         => 'nullable|numeric|min:0',
        'min_pax'                       => 'nullable|integer|min:1',
        'status'                        => 'in:active,inactive',
        'image'                         => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        'ingredients'                   => 'nullable|array',
        'ingredients.*.stock_id'        => 'required|exists:stocks,id',
        'ingredients.*.qty_per_portion' => 'required|numeric|min:0.001',
    ]);

    $imagePath = $menu->image;
    if ($request->hasFile('image')) {
        $imagePath = $request->file('image')->store('menus', 'public');
    }

    $menu->update(array_merge($validated, [
    'is_active' => ($validated['status'] ?? 'active') === 'active',
    'image'     => $imagePath,
    'category'  => $validated['category'] ?? '',
]));

    $this->syncIngredients($menu, $request->input('ingredients', []));
    return response()->json($menu->load('ingredients'));
}

    /* DELETE /owner/menus/{menu} */
    public function destroy(Menu $menu): JsonResponse
    {
        $user = $this->authUser();

        abort_if($menu->owner_id !== $user->id, 403);

        $menu->ingredients()->delete();
        $menu->delete();

        return response()->json(['message' => 'Menu deleted']);
    }

    /* ── private helper ── */

    private function syncIngredients(Menu $menu, array $rows): void
    {
        $menu->ingredients()->delete();

        $seen = [];
        foreach ($rows as $row) {
            $stockId = $row['stock_id'] ?? null;
            $qty     = $row['qty_per_portion'] ?? null;

            if (!$stockId || !$qty || isset($seen[$stockId])) {
                continue;
            }
            $seen[$stockId] = true;

            MenuIngredient::create([
                'menu_id'         => $menu->id,
                'stock_id'        => $stockId,
                'qty_per_portion' => $qty,
            ]);
        }
    }
}