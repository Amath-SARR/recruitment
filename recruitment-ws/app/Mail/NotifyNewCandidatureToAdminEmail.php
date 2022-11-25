<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class NotifyNewCandidatureToAdminEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $collaborateur, $candidature;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($collaborateur, $candidature)
    {
        $this->collaborateur = $collaborateur;
        $this->candidature = $candidature;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->markdown('mail.notify-new-candidature-to-admin-email')
            ->subject("Notification nouvelle candidature - " . config('app.name'));
    }
}
