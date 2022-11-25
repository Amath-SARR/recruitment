<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddPaiementInfoToAchatSms extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('achat_sms', function (Blueprint $table) {
            $table->string('client_phone');
            $table->string('ref_command');
            $table->string('currency');
            $table->string('env');
            $table->string('type_event');
            $table->string('payment_method');
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
            $table->dropColumn('client_phone');
            $table->dropColumn('ref_command');
            $table->dropColumn('currency');
            $table->dropColumn('env');
            $table->dropColumn('type_event');
            $table->dropColumn('payment_method');
        });
    }
}
