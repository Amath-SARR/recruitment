<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class SendResumeCandidature extends Mailable
{
    use Queueable, SerializesModels;
    private $candidatures ;
    private $candidaturesDuJours ;
    private $candidaturesInteressant ;
    private $candidaturesEnAttente ;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($activeCampagne, $candidatures, $candidatureDuJours, $candidatureInteressants, $candidatureEnAttentes)
    {
        $this->$activeCampagne = $activeCampagne;
        $this->candidatures = $candidatures;
        $this->candidatureDuJours = $candidatureDuJours;
        $this->candidatureInteressants = $candidatureInteressants;
        $this->candidatureEnAttentes = $candidatureEnAttentes;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->markdown('mail.send-resume-candidature');
    }
}
