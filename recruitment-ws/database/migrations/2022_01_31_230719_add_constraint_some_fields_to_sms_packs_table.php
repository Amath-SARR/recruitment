<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddConstraintSomeFieldsToSmsPacksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('sms_packs', function (Blueprint $table) {
            $table->string('nom')->unique()->change();
            $table->integer('nombreSms')->unique()->change();
            $table->integer('montant')->unique()->change();
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
