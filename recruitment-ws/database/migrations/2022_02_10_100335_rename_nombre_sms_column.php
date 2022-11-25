<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RenameNombreSmsColumn extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('achat_sms', function (Blueprint $table) {
            $table->renameColumn('nombreSms', 'nombre_sms');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('achat_sms', function (Blueprint $table) {
            $table->renameColumn('nombre_sms', 'nombreSms');
        });
    }
}
