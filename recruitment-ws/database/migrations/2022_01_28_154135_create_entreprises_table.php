<?php

use App\Models\DomaineIntervention;
use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEntreprisesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('entreprises', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->foreignIdFor(DomaineIntervention::class);
            $table->string('telephone');
            $table->string('email');
            $table->string('logo');
            $table->string('siteWeb');
            $table->string('adresse');
            $table->boolean('candidatureSpontanee')->default(true);
            $table->text('presentation');
            $table->foreignIdFor(User::class);
            $table->boolean('enabled')->default(true);
            $table->string('uid')->require();
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
        Schema::dropIfExists('entreprises');
    }
}
