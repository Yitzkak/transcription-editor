# Generated by Django 5.0.2 on 2024-08-29 12:08

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0003_transcription_original_audio_filename"),
    ]

    operations = [
        migrations.AddField(
            model_name="audiofile",
            name="original_filename",
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
