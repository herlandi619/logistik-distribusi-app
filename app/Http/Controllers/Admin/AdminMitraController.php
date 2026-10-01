<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Supplier;
use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminMitraController extends Controller
{
    // Hanya 1 Endpoint GET
    public function index(Request $request)
    {
        $searchSupplier = $request->input('search_supplier');
        $searchCustomer = $request->input('search_customer');

        // Query Supplier
        $suppliers = Supplier::query()
            ->when($searchSupplier, function ($query, $search) {
                $query->where('nama_supplier', 'like', "%{$search}%")
                      ->orWhere('kontak', 'like', "%{$search}%")
                      ->orWhere('alamat', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(5, ['*'], 'supplier_page')
            ->withQueryString();

        // Query Customer
        $customers = Customer::query()
            ->when($searchCustomer, function ($query, $search) {
                $query->where('nama_customer', 'like', "%{$search}%")
                      ->orWhere('kontak', 'like', "%{$search}%")
                      ->orWhere('alamat', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(5, ['*'], 'customer_page')
            ->withQueryString();

        return Inertia::render('Admin/Mitra/Index', [
            'suppliers' => $suppliers,
            'customers' => $customers,
            'filters' => [
                'search_supplier' => $searchSupplier ?? '',
                'search_customer' => $searchCustomer ?? '',
                'active_tab' => $request->input('tab', 'supplier'),
            ]
        ]);
    }

    public function store(Request $request, $tipe)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'kontak' => 'required|string|max:50',
            'alamat' => 'required|string',
        ]);

        if ($tipe === 'supplier') {
            Supplier::create([
                'nama_supplier' => $validated['nama'],
                'kontak' => $validated['kontak'],
                'alamat' => $validated['alamat'],
            ]);
        } else {
            Customer::create([
                'nama_customer' => $validated['nama'],
                'kontak' => $validated['kontak'],
                'alamat' => $validated['alamat'],
            ]);
        }

        return redirect()->back();
    }

    public function update(Request $request, $tipe, $id)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'kontak' => 'required|string|max:50',
            'alamat' => 'required|string',
        ]);

        if ($tipe === 'supplier') {
            Supplier::findOrFail($id)->update([
                'nama_supplier' => $validated['nama'],
                'kontak' => $validated['kontak'],
                'alamat' => $validated['alamat'],
            ]);
        } else {
            Customer::findOrFail($id)->update([
                'nama_customer' => $validated['nama'],
                'kontak' => $validated['kontak'],
                'alamat' => $validated['alamat'],
            ]);
        }

        return redirect()->back();
    }

    public function destroy($tipe, $id)
    {
        if ($tipe === 'supplier') {
            Supplier::findOrFail($id)->delete();
        } else {
            Customer::findOrFail($id)->delete();
        }

        return redirect()->back();
    }
}