<?php

namespace App\Console\Commands;

use App\Mail\SendResumeCandidature;
use Illuminate\Console\Command;
use App\Models\Campagne;
use App\Models\Candidature;
use App\Models\StateCandidature;
use Illuminate\Support\Facades\Mail;

class SendResumeCandidatureCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'resume:candidature';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $dateDuJour = date('Y-m-d');
        $activeCampagnes = Campagne::where('dateLancement', '<=', $dateDuJour)
            ->where('dateCloture', '>=', $dateDuJour)
            ->with('user')
            ->get();
        foreach ($activeCampagnes as $activeCampagne) {
            $candidatures = Candidature::where('campagne_id', $activeCampagne->id)->count();
            $candidatureDuJours = Candidature::where("created_at",'=', $dateDuJour)->count();
            $candidatureInteressants = Candidature::where('interessant', true)->count();
            $candidatureEnAttentes = StateCandidature::where('typeState', 'initial')->count();
            Mail::to($activeCampagne->user->email)->send(
                new SendResumeCandidature($activeCampagne, $candidatures, $candidatureDuJours,
                 $candidatureInteressants, $candidatureEnAttentes));
        }
        /* foreach ($activeCampagnes as $all) {


            Mail::raw(
                "Bonsoir M/Mme {$all->user->name}, \n
                Le nombre de candidats qui sont postulés suite au lancement de votre campagne sont au nombre de $candidatures\n
                Parmis eux $candidaturesDuJours est(sont) postulé(s) aujourd'hui \n
                $candidaturesInteressant  candidatures marquées comme étant intéressantes et\n
                $candidaturesEnAttente candidature(s) est(sont) en attente",
                function ($message)  use ($all) {
                    $message->from('sarrelhadjiamath@gmail.com');
                    $message->to($all->user->email)->subject('Rapport des candidatures du jours');
                }
            );
        } */
    }
}
