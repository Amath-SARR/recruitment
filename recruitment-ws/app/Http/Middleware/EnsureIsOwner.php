<?php

namespace App\Http\Middleware;

use App\Models\Entreprise;
use Closure;
use Error;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EnsureIsOwner
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        $entreprise= Entreprise::find($request->entreprise_id);
        if($request->user()!=null) {
            if($request->user()->type=='admin' || $entreprise->user_id==Auth::id()) {
                return $next($request);
            }
        }
        throw new Error('Privilège insuffisant, merci de contacter un administrateur...');
    }
}
