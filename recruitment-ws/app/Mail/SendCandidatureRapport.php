<?php

namespace App\Mail;

use App\Models\Candidature;
use Illuminate\Bus\Queueable;
use Illuminate\Http\Request;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class SendCandidatureRapport extends Mailable
{
    use Queueable, SerializesModels;
    private $candidature;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(Candidature $candidature)
    {
        $this->candidature = $candidature;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->markdown('mail.send-candidature-rapport', ['candidature' => $this->candidature])->subject("Rapport de dossier de candidature - " . config('app.name'));
    }
}
