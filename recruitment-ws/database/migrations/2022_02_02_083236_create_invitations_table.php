<?php
use App\Models\User;
use App\Models\Entreprise;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateInvitationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('invitations', function (Blueprint $table) {
            $table->id();
            $table->string('uid')->require();
            $table->string('nom')->require();
            $table->string('prenoms')->require();
            $table->string('email')->require();
            $table->string('telephone')->nullable();
            $table->foreignIdFor(User::class);
            $table->foreignIdFor(Entreprise::class);
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
        Schema::dropIfExists('invitations');
    }
}
