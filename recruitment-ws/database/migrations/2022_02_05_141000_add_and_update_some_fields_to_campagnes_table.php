<?php

use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddAndUpdateSomeFieldsToCampagnesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('campagnes', function (Blueprint $table) {
            // added fields
            $table->foreignIdFor(User::class);
            $table->string('uid');
            $table->boolean('archivee')->default(false);
            // fields to update
            $table->renameColumn('cloture','dateCloture');
            $table->renameColumn('lancement','dateLancement');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('campagnes', function (Blueprint $table) {
            //
        });
    }
}
