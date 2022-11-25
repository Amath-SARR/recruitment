<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class SendUsersMail extends Mailable
{
    use Queueable, SerializesModels;

    public $message;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($message)
    {
        $this->message = $message;
    }

    /**
     * Build the message
     *
     * @author Cheikh Tidiane GUEYE
     * @since 02.02.22
     * @return $this
     */
    public function build()
    {
        return $this->markdown('mail.send-users-mail', ['message' => $this->message])
            ->subject($this->message->objet . " - " . config('app.name'));
    }
}
