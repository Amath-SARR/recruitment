<?php

use App\Models\Entreprise;
use App\Models\SmsPack;
use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAchatSmsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('achat_sms', function (Blueprint $table) {
            $table->id();
            $table->string('uid')->require();
            $table->foreignIdFor(Entreprise::class);
            $table->foreignIdFor(SmsPack::class);
            $table->foreignIdFor(User::class);
            $table->integer('montant');
            $table->integer('nombreSms');
            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('achat_sms');
    }
}
