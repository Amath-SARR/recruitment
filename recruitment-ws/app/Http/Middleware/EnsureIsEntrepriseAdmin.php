<?php

namespace App\Http\Middleware;

use App\Custom\CustomResponse;
use App\Models\Collaborateur;
use App\Models\Entreprise;
use Closure;
use Error;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EnsureIsEntrepriseAdmin
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
        if ($request->user() != null) {
            $collaborateurs = Collaborateur::whereUserId($request->user()->id)->whereEntrepriseId($request->entreprise_id)->get();
            if ($request->user()->type == 'admin' || count($collaborateurs) > 0) {
                return $next($request);
            }
        }
        throw new Error('Privilège insuffisant, merci de contacter un administrateur...');
    }
}
