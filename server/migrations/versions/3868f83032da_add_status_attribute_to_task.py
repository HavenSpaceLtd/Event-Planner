"""Add status attribute to Task

Revision ID: 3868f83032da
Revises: 9f9d4b43761a
Create Date: 2024-03-12 17:00:41.060958

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '3868f83032da'
down_revision = '9f9d4b43761a'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('assets', schema=None) as batch_op:
        batch_op.alter_column('availability_status',
               existing_type=sa.BOOLEAN(),
               type_=sa.String(),
               existing_nullable=True)

    with op.batch_alter_table('tasks', schema=None) as batch_op:
        batch_op.add_column(sa.Column('status', sa.String(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('tasks', schema=None) as batch_op:
        batch_op.drop_column('status')

    with op.batch_alter_table('assets', schema=None) as batch_op:
        batch_op.alter_column('availability_status',
               existing_type=sa.String(),
               type_=sa.BOOLEAN(),
               existing_nullable=True)

    # ### end Alembic commands ###
