<?php

namespace App\Mail;

use App\Models\Candidature;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class NotifyConfirmeReceptionToCandidatEmail extends Mailable
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
        return $this->markdown('mail.notify-confirme-reception-to-candidat-email', ['candidature' => $this->candidature])
            ->subject("Confirmation de réception relative au dépôt de candidature - " . config('app.name'));
    }
}
