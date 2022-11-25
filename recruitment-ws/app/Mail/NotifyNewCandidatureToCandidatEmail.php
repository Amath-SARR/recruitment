<?php

namespace App\Mail;

use App\Models\Candidature;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class NotifyNewCandidatureToCandidatEmail extends Mailable
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
     * @author Cheikh Tidiane GUEYE
     * @return $this
     */
    public function build()
    {
        return $this->markdown('mail.notify-new-candidature-to-candidat-email', ['candidature' => $this->candidature])
            ->subject("Notification relative au dépôt de candidature - " . config('app.name'));
    }
}
