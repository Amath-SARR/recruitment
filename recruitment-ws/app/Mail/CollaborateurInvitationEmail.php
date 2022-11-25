<?php

namespace App\Mail;

use App\Models\Invitation;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CollaborateurInvitationEmail extends Mailable
{
    use Queueable, SerializesModels;
    private $invitation;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(Invitation $invitation)
    {
        $this->invitation = $invitation;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->markdown('mail.collaborateur-invitation-email', ['invitation' => $this->invitation])
            ->subject("Invitation à collaborer - " . $this->invitation->entreprise->name)
            ->replyTo($this->invitation->user->email);
    }
}
