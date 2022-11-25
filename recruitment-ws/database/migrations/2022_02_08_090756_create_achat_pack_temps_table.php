<?php

use App\Models\Entreprise;
use App\Models\SmsPack;
use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAchatPackTempsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('achat_pack_temps', function (Blueprint $table) {
            $table->id();
            $table->string('uid')->require();
            $table->timestamps();
            $table->foreignIdFor(Entreprise::class);
            $table->foreignIdFor(SmsPack::class);
            $table->foreignIdFor(User::class);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('achat_pack_temps');
    }
}
