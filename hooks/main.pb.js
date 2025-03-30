/// <reference path="../pb_data/types.d.ts" />
routerAdd('POST', '/api/invite/{code}', (e) => {
  let code = e.request.pathValue('code');

  let authRecord = e.auth;

  let data = {
    email: '',
    playgroup_id: '',
    playgroup_name: '',
    message: ''
  };
  if (!authRecord) {
    return e.json(401, { error: 'auth required' });
  }
  data.email = authRecord.email();

  try {
    let playgroup = $app.findFirstRecordByFilter('playgroups', `invite_key={:code}`, {
      code: code
    });
    data.playgroup_id = playgroup.get('id');
    data.playgroup_name = playgroup.get('name');

    const members = playgroup.get('members');
    if (members.includes(authRecord.id)) {
      data.message = 'You are already a member of this group!';
      return e.json(202, data);
    }

    playgroup.set('members+', authRecord.id);
    $app.save(playgroup);
  } catch (err) {
    return e.json(404, { error: 'no such group' });
  }

  data.message = 'You successfully joined the playgroup!';
  return e.json(200, data);
});
