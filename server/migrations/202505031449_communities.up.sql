ALTER TABLE chat RENAME TO community;

ALTER TABLE community ADD COLUMN description TEXT DEFAULT '';
UPDATE community SET description = '';
ALTER TABLE community ALTER COLUMN description SET NOT NULL;
ALTER TABLE community ADD COLUMN config JSONB;

UPDATE community c
SET config = '{
    "fields": [
        {
            "type": "textinput",
            "title": "Место работы",
            "textinput": {}
        },
        {
            "type": "textinput",
            "title": "Должность",
            "textinput": {}
        },
        {
            "type": "textarea",
            "title": "Описание",
            "textarea": {}
        }
    ]
}'::jsonb;

ALTER TABLE community ALTER COLUMN config SET NOT NULL;

ALTER TABLE community RENAME COLUMN "telegram_id" TO "tg_chat_id";

ALTER TABLE "chat_user" RENAME TO "member";

ALTER TABLE "member" RENAME COLUMN "chat_id" TO "community_id";

ALTER TABLE "member" ADD COLUMN "config" JSONB;

UPDATE member m
SET config = jsonb_build_object(
    'fields', jsonb_build_object(
        'Место работы', jsonb_build_object(
            'type', 'textinput',
            'textinput', jsonb_build_object(
                'value', u.company
            )
        ),
        'Должность', jsonb_build_object(
            'type', 'textinput',
            'textinput', jsonb_build_object(
                'value', u.role
            )
        ),
        'Описание', jsonb_build_object(
            'type', 'textarea',
            'textarea', jsonb_build_object(
                'value', u.bio
            )
        )
    )
)
FROM "user" u
WHERE m.user_id = u.id;

ALTER TABLE "member" ALTER COLUMN "config" SET NOT NULL;
ALTER TABLE "member" ADD COLUMN "is_admin" BOOLEAN DEFAULT FALSE;
ALTER TABLE "member" ALTER COLUMN "is_admin" SET NOT NULL;

ALTER TABLE "user" DROP COLUMN "company";
ALTER TABLE "user" DROP COLUMN "role";
ALTER TABLE "user" DROP COLUMN "bio";
