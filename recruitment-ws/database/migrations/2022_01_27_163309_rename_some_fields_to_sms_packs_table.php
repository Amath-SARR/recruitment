<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RenameSomeFieldsToSmsPacksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('sms_packs', function (Blueprint $table) {
            $table->renameColumn('nomDuPack', 'nom');
            $table->renameColumn('numero', 'montant');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('sms_packs', function (Blueprint $table) {
            //
        });
    }
}
